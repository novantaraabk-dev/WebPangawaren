'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemoFirebase, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { ArrowRight, Megaphone, Sparkles, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Announcement } from '@/lib/types';
import { formatDisplayDate } from './landing-utils';
import { CardContourPattern } from './CardContourPattern';

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
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full mb-3 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-widest">Pengumuman & Agenda Desa</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display italic tracking-tight leading-tight">
          Informasi Publik <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 not-italic">Penting & Resmi</span>
        </h2>
        <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-600 font-medium">
          Pengumuman resmi dan agenda kegiatan pembangunan Desa Pangawaren yang perlu diketahui oleh seluruh masyarakat.
        </p>
      </motion.div>

      <div className="mt-12 space-y-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 rounded-[2.25rem] border border-emerald-600/20 bg-white p-6 shadow-sm">
              <Skeleton className="w-full md:w-48 h-36 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-7 w-3/4 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="rounded-[2.25rem] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700 font-semibold">
            Pengumuman sedang tidak dapat dimuat saat ini.
          </div>
        ) : !announcements || announcements.length === 0 ? (
          <div className="rounded-[2.25rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600 font-medium">
            Belum ada pengumuman publik yang dibagikan.
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <motion.article
              key={announcement.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative overflow-hidden rounded-[2.25rem] border border-slate-100 bg-white p-6 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
            >
              <CardContourPattern opacity={0.03} className="text-emerald-500" />
              {/* Glowing Corner Accent */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:from-emerald-500/20" />
              
              {/* Subtle Dot Grid pattern */}
              <div className="absolute right-6 top-6 text-slate-200 transition-colors duration-300 group-hover:text-emerald-300/40 pointer-events-none">
                <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                  <pattern id={`announcement-dots-${index}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor" />
                  </pattern>
                  <rect width="40" height="40" fill={`url(#announcement-dots-${index})`} />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Image Thumbnail Container */}
                <div className="relative w-full md:w-52 h-44 md:h-36 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100/80 shadow-inner group-hover:shadow-md transition-shadow">
                  {announcement.imageUrl ? (
                    <Image
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700">
                      <Megaphone className="h-9 w-9 mb-1 text-emerald-600 opacity-80" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Pengumuman</span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="flex-1 space-y-2.5 w-full">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-wider text-slate-500">
                    <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 font-black text-emerald-700 shadow-xs">
                      Penting & Resmi
                    </span>
                    <span>• {formatDisplayDate(announcement.publishDate)}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-slate-900 font-display italic tracking-tight transition-colors group-hover:text-emerald-700 line-clamp-2">
                    {announcement.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500 font-medium line-clamp-2">
                    {announcement.content}
                  </p>

                  <div className="pt-2 flex items-center justify-end">
                    <Link href={`/pengumuman/${announcement.id}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 group-hover:underline">
                      Buka Detail Pengumuman
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}

