'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemoFirebase, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { VillageProfileInfo } from '@/lib/types';
import { CardContourPattern } from './CardContourPattern';

export function CtaSection() {
  const firestore = useFirestore();
  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profileData } = useDoc<VillageProfileInfo>(profileRef);
  const pengaduanImageUrl = profileData?.pengaduanImageUrl || 'https://picsum.photos/seed/pengaduan/600/800';

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-[2.25rem] border border-emerald-200 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 shadow-xl shadow-emerald-950/20"
      >
        <CardContourPattern opacity={0.03} className="text-emerald-200" />
        <div className="grid gap-0 lg:grid-cols-[auto_1fr_auto] lg:items-center">

          {/* LEFT: Layanan Pengaduan Poster Image - Fits natural height */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative hidden lg:flex items-center justify-center bg-black/25 p-3 self-stretch"
          >
            <Link
              href="/nomor-penting/"
              className="relative aspect-[3/4] h-56 md:h-60 flex items-center justify-center group overflow-hidden rounded-2xl border border-white/10 shadow-lg"
              aria-label="Layanan Pengaduan Masyarakat"
            >
              <Image
                src={pengaduanImageUrl}
                alt="Layanan Pengaduan Masyarakat"
                fill
                sizes="240px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </Link>
          </motion.div>

          {/* CENTER: Main CTA Content */}
          <div className="p-6 sm:p-8 md:p-10 text-white flex flex-col justify-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-100 w-fit backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Portal Desa Digital
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display italic tracking-tight leading-tight">
              Butuh Pelayanan Desa? <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white not-italic">Ajukan Sekarang</span>
            </h2>
            <p className="max-w-xl text-sm sm:text-base leading-relaxed text-emerald-50/90 font-medium">
              Ajukan seluruh pelayanan administrasi dan dokumen resmi desa secara online melalui Portal Desa Pangawaren — cepat, aman, transparan, dan dapat diakses dari mana saja.
            </p>
            {/* Mobile: Pengaduan button */}
            <div className="mt-4 flex lg:hidden">
              <Link href="/pengaduan/" aria-label="Buat pengaduan warga">
                <Button className="h-10 rounded-full bg-amber-400 px-6 font-black uppercase text-xs tracking-wider text-slate-950 transition-all duration-300 hover:bg-amber-300 shadow-md">
                  Layanan Pengaduan
                  <MessageSquareWarning className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: Action Card */}
          <div className="p-6 sm:p-8 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-5 md:p-6 backdrop-blur-md w-full lg:w-[275px] shadow-xl flex flex-col justify-between space-y-4"
            >
              <CardContourPattern opacity={0.03} className="text-amber-200" />
              <div className="flex items-center gap-3 text-emerald-50">
                <div className="p-2.5 bg-amber-400/20 rounded-xl shrink-0 border border-amber-300/30">
                  <ShieldCheck className="h-6 w-6 text-amber-300" />
                </div>
                <p className="text-xs sm:text-sm font-bold leading-snug">Layanan resmi & 100% gratis tanpa pungutan</p>
              </div>
              <Link href="/layanan-surat/" className="w-full" aria-label="Ajukan layanan desa">
                <Button className="h-11 rounded-full bg-amber-400 hover:bg-amber-300 px-4 text-[11px] sm:text-xs font-black uppercase tracking-wide text-slate-950 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-amber-400/20 w-full flex items-center justify-center gap-1.5 whitespace-nowrap">
                  <span>Ajukan Layanan Online</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Button>
              </Link>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
