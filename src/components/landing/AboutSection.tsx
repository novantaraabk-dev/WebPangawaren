'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemoFirebase, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ArrowRight, BadgeCheck, Landmark, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContourPattern } from './CardContourPattern';

export function AboutSection() {
  const firestore = useFirestore();
  const aboutRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: aboutData } = useDoc<{ description?: string; imageUrl?: string }>(aboutRef);
  const description = aboutData?.description || 'Desa Pangawaren merupakan wilayah yang berkembang dengan semangat gotong royong, pelayanan publik yang responsif, dan komitmen menjaga kesejahteraan masyarakat melalui tata kelola pemerintahan yang modern dan terbuka.';
  const imageUrl = aboutData?.imageUrl || 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200';

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -6, scale: 1.01 }}
          className="relative"
        >
          <div className="absolute inset-0 -translate-y-4 rotate-2 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/50 to-teal-200/50 blur-sm" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-3 shadow-2xl shadow-emerald-500/10 transition-all duration-300">
            <CardContourPattern opacity={0.03} className="text-emerald-600" />
            <Image
              src={imageUrl}
              alt="Kantor Desa Pangawaren"
              width={900}
              height={700}
              className="h-[420px] w-full rounded-[2rem] object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full mb-3 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest">Profil & Sejarah Wilayah</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display italic tracking-tight leading-tight">
              Mengenal Lebih Dekat <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 not-italic">Desa Pangawaren</span>
            </h2>
          </div>

          <div className="space-y-4 text-base md:text-lg leading-relaxed text-slate-600 font-medium">
            <p>{description}</p>
            <p>
              Melalui portal digital modern, masyarakat dapat mengakses pelayanan publik secara langsung, memahami transparansi informasi wilayah, dan berpartisipasi aktif dalam pembangunan desa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-700 shadow-xs">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              Layanan Resmi Desa
            </div>
            <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-700 shadow-xs">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Digital & Transparan
            </div>
          </div>
          <div>
            <Link href="/profil-desa/" aria-label="Lihat profil desa lengkap">
              <Button className="h-12 rounded-full bg-gradient-to-r from-emerald-700 to-teal-700 px-7 text-xs font-black uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 shadow-xl shadow-emerald-700/20">
                Profil Desa Selengkapnya
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
