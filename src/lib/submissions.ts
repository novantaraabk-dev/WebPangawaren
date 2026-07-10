
'use client';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  Firestore,
  query,
  orderBy,
  limit,
  DocumentReference,
  where,
  getDocs,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LetterSubmission, UploadedFile, DriveSettingsInfo } from './types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Extracts a Google Drive folder ID from a full URL or returns the raw ID. */
function extractFolderId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  const id = match ? match[1] : trimmed;
  // Strip query parameters like ?hl=ID or ?usp=sharing
  return id.split('?')[0].split('#')[0];
}

// Helper interface for file data before it's sent to Google Drive
interface FileToUpload {
    base64Data: string;
    mimeType: string;
    targetFileName: string;
    fieldName: string; // To map back the result from Google Drive
}

// Updated data structure for new anonymous submissions from the client forms
interface NewSubmissionData {
  ticketNumber: string;
  requesterName: string;
  nik: string;
  letterType: string;
  formData: { [key: string]: any };
  filesToUpload?: FileToUpload[]; // Contains files to be uploaded to Google Drive
  fileLinks?: UploadedFile[]; // Optional pre-uploaded file links (for mock or external uploads)
  requestorAuthUid?: string; // NEW: To store real user UID
}

export const getLetterRequestsCollection = (db: Firestore) => collection(db, 'letterRequests');

export const getLetterRequestsQuery = (db: Firestore) =>
  query(getLetterRequestsCollection(db), orderBy('createdAt', 'desc'), limit(100));

export const getSubmissionById = async (
  db: Firestore,
  id: string
): Promise<LetterSubmission | null> => {
    if (!id || !db) return null;
    
    try {
        const trimmedId = id.trim();
        let docSnap = null;

        // 1. Try to fetch by Firestore Document ID
        const docRef = doc(db, 'letterRequests', trimmedId);
        const directSnap = await getDoc(docRef);

        if (directSnap.exists()) {
            docSnap = directSnap;
        } else {
            // 2. Try to query by ticketNumber field
            const q = query(getLetterRequestsCollection(db), where('ticketNumber', '==', trimmedId));
            const querySnap = await getDocs(q);
            if (!querySnap.empty) {
                docSnap = querySnap.docs[0];
            }
        }

        if (docSnap && docSnap.exists()) {
            const data = docSnap.data();
            
            // Robust parsing for legacy submissionData
            let mainData = data;
            if (data.submissionData && typeof data.submissionData === 'string') {
                try {
                    mainData = JSON.parse(data.submissionData);
                } catch (e) {
                    console.warn("Failed to parse legacy submissionData for ID:", docSnap.id, e);
                }
            }

            return {
                id: docSnap.id,
                requesterName: data.requesterName || mainData.name || mainData.requesterName || '',
                nik: data.nik || mainData.nik || '',
                phoneNumber: mainData.phoneNumber || data.phoneNumber || '',
                email: mainData.email || data.email || '',
                letterType: data.letterType || 'Surat Keterangan',
                status: data.status || 'pending',
                date: data.createdAt?.toDate()?.toISOString() ?? new Date().toISOString(),
                formData: mainData.formData || mainData,
                documentNumber: data.documentNumber,
                fileLinks: data.fileLinks || [],
                createdAt: data.createdAt,
                ticketNumber: data.ticketNumber,
            } as LetterSubmission;
        }
    } catch (error) {
        console.error("Error in getSubmissionById:", error);
        throw error;
    }
    return null;
};

/**
 * Adds a new letter submission by first uploading files to Google Drive via Apps Script,
 * then saving the submission data with the returned file links to Firestore.
 */
export const addSubmission = async (
  db: Firestore,
  submissionData: NewSubmissionData
): Promise<DocumentReference> => {
  // Default fallbacks
  let APP_SCRIPT_URL = '';
  let ROOT_FOLDER_ID = '';

  try {
    const driveRef = doc(db, 'driveSettings', 'default');
    const driveSnap = await getDoc(driveRef);
    if (driveSnap.exists()) {
        const driveData = driveSnap.data() as DriveSettingsInfo;
        APP_SCRIPT_URL = (driveData.appsScriptUrl || '').trim();
        ROOT_FOLDER_ID = extractFolderId(driveData.rootFolderId || '');
    }
  } catch (e) {
      console.warn("Failed to load Drive settings from Firestore.");
  }

  const { formData, filesToUpload, requestorAuthUid, ...restOfData } = submissionData;
  const collectionRef = getLetterRequestsCollection(db);

  let finalFileLinks: UploadedFile[] = [];

  // Step 1: Upload files to Google Drive if they exist and settings are available
  if (APP_SCRIPT_URL && ROOT_FOLDER_ID && filesToUpload && filesToUpload.length > 0) {
    try {
      const uploadPayload = {
        rootFolderId: ROOT_FOLDER_ID, // KIRIM ROOT_FOLDER_ID KE APPS SCRIPT
        folderName: `${submissionData.letterType} - ${submissionData.requesterName} - ${submissionData.nik}`.toUpperCase(),
        letterType: submissionData.letterType,
        requesterName: submissionData.requesterName,
        files: filesToUpload.map(f => ({
            base64Data: f.base64Data,
            mimeType: f.mimeType,
            targetFileName: f.targetFileName,
        }))
      };

      const response = await fetch(APP_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(uploadPayload),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
      });
      
      const resultText = await response.text();
      const result = JSON.parse(resultText);

      if (result.status !== 'success') {
        throw new Error(result.message || 'Error dari Apps Script.');
      }
      
      const uploadedFiles: Array<{ fileId: string; fileName: string; }> = result.files;

      finalFileLinks = uploadedFiles.map((uploadedFile, index) => {
          const originalFile = filesToUpload[index];
          return {
              fieldName: originalFile.fieldName,
              fileId: uploadedFile.fileId,
              fileName: uploadedFile.fileName,
          };
      });

    } catch (error: any) {
      console.error("Error during Google Drive upload:", error);
      throw new Error(`Gagal mengunggah file. Pastikan URL Apps Script dan ID Folder sudah benar di Pengaturan. (${error.message})`);
    }
  } else if ((!APP_SCRIPT_URL || !ROOT_FOLDER_ID) && filesToUpload && filesToUpload.length > 0) {
    throw new Error("Konfigurasi Google Drive (URL & ID Folder) belum lengkap di menu Pengaturan Admin.");
  }

  // Step 2: Save submission metadata to Firestore
  const auth = getAuth();
  const docToSave = {
    ...formData,
    ...restOfData,
    fileLinks: finalFileLinks,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    requestorAuthUid: requestorAuthUid || auth.currentUser?.uid || 'anonymous', 
  };

  try {
    const docRef = await addDoc(collectionRef, docToSave);
    return docRef;
  } catch (error) { 
    console.error("Error adding document to Firestore:", error);
    throw new Error("Gagal menyimpan data pengajuan ke database.");
  }
};


// --- Admin Panel Functions ---

export const updateSubmissionStatus = (
  db: Firestore,
  id: string,
  status: 'approved' | 'rejected'
) => {
  const docRef = doc(db, 'letterRequests', id);
  const data = { status, updatedAt: serverTimestamp() };
  updateDoc(docRef, data).catch((error) => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: data,
      })
    );
  });
};

export const setSubmissionDocumentNumber = (
  db: Firestore,
  id: string,
  documentNumber: string
) => {
  const docRef = doc(db, 'letterRequests', id);
  const data = { documentNumber, updatedAt: serverTimestamp() };
  const promise = updateDoc(docRef, data);
  promise.catch((error) => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: data,
      })
    );
  });
  return promise;
};

export const deleteSubmission = (db: Firestore, id: string) => {
  const docRef = doc(db, 'letterRequests', id);
  deleteDoc(docRef).catch((error) => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      })
    );
  });
};
