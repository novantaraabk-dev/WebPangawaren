'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemoFirebase, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ArrowRight, Building2, CheckCircle2, ChevronDown, FileText, MessageSquareWarning, Newspaper, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const floatingItems = [
  { icon: FileText, label: 'Ajukan Surat', href: '/layanan-surat/' },
  { icon: MessageSquareWarning, label: 'Pengaduan', href: '/pengaduan' },
  { icon: Users, label: 'Statistik Desa', href: '/statistik/' },
  { icon: Newspaper, label: 'Berita Desa', href: '/BeritaDesa/' },
  { icon: Building2, label: 'Pengumuman', href: '/pengumuman/' },
  { icon: Sparkles, label: 'Layanan Online', href: '/pelayanan-desa/' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const;

export function HeroSection() {
  const firestore = useFirestore();
  const heroRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'heroImage', 'default');
  }, [firestore]);

  const { data: heroData } = useDoc<{ imageUrl?: string }>(heroRef);
  const heroImageUrl = heroData?.imageUrl || 'https://images.unsplash.com/photo-1602989106211-81de671c23a9?q=80&w=2000';

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 min-h-screen lg:h-screen lg:min-h-[680px] lg:max-h-[1000px] flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src={heroImageUrl}
          alt="Pemandangan desa Pangawaren"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_40%),linear-gradient(100deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.72)_48%,rgba(6,78,59,0.58)_100%)]" />
      
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-20 lg:pb-16">
        <div className="grid w-full items-center gap-8 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl space-y-4 lg:space-y-4.5"
          >
            {/* Top Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300 backdrop-blur-md shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Portal Resmi Desa Digital</span>
            </motion.div>

            {/* Main Title & Subtitle */}
            <motion.div variants={itemVariants} className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display uppercase tracking-tight text-white leading-none">
                DESA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">PANGAWAREN</span>
              </h1>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-emerald-200/90 font-sans">
                Kecamatan Karangpucung • Kabupaten Cilacap
              </p>
            </motion.div>

            {/* Slogan */}
            <motion.h2 variants={itemVariants} className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-snug font-display italic">
              Melayani Masyarakat Dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 not-italic">Cepat, Mudah & Transparan</span>
            </motion.h2>

            {/* Clean Redaction / Description */}
            <motion.p variants={itemVariants} className="text-sm sm:text-base leading-relaxed text-slate-200/90 font-medium max-w-xl">
              Pusat pelayanan administrasi resmi warga, publikasi keterbukaan informasi desa, aspirasi pengaduan, dan data kependudukan terpadu dalam satu platform digital modern.
            </motion.p>

            {/* Gratis Pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur-md">
              <span className="inline-flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Seluruh pelayanan administrasi di Desa Pangawaren adalah <strong className="font-bold text-amber-300 underline underline-offset-2">GRATIS (Rp 0,-)</strong></span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/layanan-surat/" aria-label="Ajukan layanan desa">
                <Button className="h-11 rounded-full bg-amber-400 px-6 text-sm font-black uppercase tracking-wider text-slate-950 shadow-[0_12px_30px_rgba(250,204,21,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-300">
                  Ajukan Layanan
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/profil-desa/" aria-label="Lihat profil desa">
                <Button variant="outline" className="h-11 rounded-full border-white/20 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 hover:text-white transition-all">
                  Profil Desa
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Card: Fokus Layanan */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="rounded-[2rem] border border-white/15 bg-white/12 p-4 sm:p-5 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Fokus Layanan</p>
                    <p className="text-base sm:text-lg font-semibold text-white">Portal pelayanan masyarakat</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {floatingItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.label} href={item.href} className="block">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 + index * 0.04, duration: 0.3 }}
                          whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.25)' }}
                          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 p-2.5 text-xs sm:text-sm text-slate-200 cursor-pointer transition-colors duration-200 h-full"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/12 text-emerald-300 shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-semibold truncate">{item.label}</span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 z-20 hidden lg:flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.25em] pointer-events-none">
        <span>Scroll</span>
        <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
      </div>

      {/* Smooth Curved Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-12 w-full pointer-events-none overflow-hidden z-10">
        <svg 
          className="absolute bottom-0 w-full h-12 text-slate-50 fill-current" 
          viewBox="0 0 1440 100" 
          preserveAspectRatio="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,50 C480,100 960,100 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </section>
  );
}
