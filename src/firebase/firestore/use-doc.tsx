'use client';

import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  getDoc,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

export interface UseDocOptions {
  realtime?: boolean;
  cacheTtl?: number; // Cache duration in milliseconds (default: 30 seconds)
  suppressGlobalError?: boolean;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  promise?: Promise<any>;
}

// Global in-memory cache for document references
const globalDocCache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 30000; // 30 seconds

/**
 * React hook to retrieve a single Firestore document.
 * Fetches once with caching by default to conserve read quota.
 * Opt-in to real-time sync with `{ realtime: true }`.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedDocRef using useMemo.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
  options?: UseDocOptions
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  const isRealtime = !!options?.realtime;
  const cacheTtl = options?.cacheTtl ?? DEFAULT_TTL_MS;

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const docPath = memoizedDocRef.path;

    if (isRealtime) {
      // Real-time synchronization mode (onSnapshot)
      setIsLoading(true);
      setError(null);

      const unsubscribe = onSnapshot(
        memoizedDocRef,
        (snapshot: DocumentSnapshot<DocumentData>) => {
          if (snapshot.exists()) {
            setData({ ...(snapshot.data() as T), id: snapshot.id });
          } else {
            setData(null);
          }
          setError(null);
          setIsLoading(false);
        },
        (err: FirestoreError) => {
          const contextualError = new FirestorePermissionError({
            operation: 'get',
            path: docPath,
          });

          setError(contextualError);
          setData(null);
          setIsLoading(false);
          if (!options?.suppressGlobalError) {
            errorEmitter.emit('permission-error', contextualError);
          }
        }
      );

      return () => unsubscribe();
    } else {
      // One-time cached fetch mode
      const now = Date.now();
      const cached = globalDocCache.get(docPath);

      // Check if we have a fresh cache entry
      if (cached && now - cached.timestamp < cacheTtl) {
        if (cached.promise) {
          setIsLoading(true);
          setError(null);
          cached.promise
            .then((res) => {
              setData(res);
              setIsLoading(false);
            })
            .catch((err) => {
              setError(err);
              setIsLoading(false);
            });
        } else {
          setData(cached.data);
          setIsLoading(false);
          setError(null);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      // Deduplicate simultaneous requests for the same path
      const fetchPromise = getDoc(memoizedDocRef)
        .then((snapshot) => {
          let result: StateDataType = null;
          if (snapshot.exists()) {
            result = { ...(snapshot.data() as T), id: snapshot.id };
          }
          // Cache the final resolved data
          globalDocCache.set(docPath, {
            data: result,
            timestamp: Date.now(),
          });
          return result;
        })
        .catch((err) => {
          // Invalidate cache immediately on error
          globalDocCache.delete(docPath);
          throw err;
        });

      // Temporarily store the fetch promise in cache to share it with concurrent hook calls
      globalDocCache.set(docPath, {
        data: null,
        timestamp: now,
        promise: fetchPromise,
      });

      fetchPromise
        .then((res) => {
          setData(res);
          setIsLoading(false);
        })
        .catch((err) => {
          const contextualError = new FirestorePermissionError({
            operation: 'get',
            path: docPath,
          });
          setError(contextualError);
          setData(null);
          setIsLoading(false);
          if (!options?.suppressGlobalError) {
            errorEmitter.emit('permission-error', contextualError);
          }
        });
    }
  }, [memoizedDocRef, isRealtime, cacheTtl]);

  return { data, isLoading, error };
}