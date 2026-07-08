'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { ArrowRight, Megaphone, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Announcement } from '@/lib/types';
import { formatDisplayDate } from './landing-utils';

export function AnnouncementSection() {
  const firestore = useFirestore();
  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'announcements'), orderBy('publishDate', 'desc'), limit(3));
  }, [firestore]);

  const { data: announcements, isLoading, error } = useCollection<Announcement>(announcementsQuery);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
        className="max-w-2xl"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Pengumuman</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Informasi penting yang perlu diketahui masyarakat.
        </h2>
      </motion.div>

      <div className="mt-12 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[1.5rem] border border-emerald-600/20 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.04)]">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-7 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
            </div>
          ))
        ) : error ? (
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
            Pengumuman sedang tidak dapat dimuat saat ini.
          </div>
        ) : !announcements || announcements.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
            Belum ada pengumuman publik yang dibagikan.
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <motion.article
              key={announcement.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative overflow-hidden flex flex-col gap-5 rounded-[1.5rem] border border-emerald-600/20 hover:border-emerald-500/40 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.04)] transition-all duration-300 md:flex-row md:items-start md:justify-between"
            >
              {/* Glowing Corner Accent */}
              <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-emerald-500/5 blur-xl transition-all duration-500 group-hover:bg-emerald-500/10 group-hover:scale-125" />
              
              {/* Subtle Dot Grid pattern */}
              <div className="absolute right-5 top-5 text-slate-200 transition-colors duration-300 group-hover:text-emerald-200/50 pointer-events-none">
                <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                  <pattern id={`announcement-dots-${index}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor" />
                  </pattern>
                  <rect width="40" height="40" fill={`url(#announcement-dots-${index})`} />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between w-full">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">Penting</span>
                      <span>{formatDisplayDate(announcement.publishDate)}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-emerald-800">{announcement.title}</h3>
                    <p className="max-w-3xl text-sm leading-7 text-slate-600">{announcement.content}</p>
                  </div>
                </div>
                <Link href={`/pengumuman/${announcement.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 self-start md:self-center shrink-0">
                  Lihat semua
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}
