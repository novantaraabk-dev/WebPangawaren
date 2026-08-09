'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquareWarning, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContourPattern } from './CardContourPattern';

export function ComplaintSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.005 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-emerald-500/5 transition-all duration-300"
      >
        <CardContourPattern opacity={0.03} className="text-emerald-600" />
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/0 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-12 translate-y-12 rounded-full bg-gradient-to-tr from-amber-500/10 to-orange-500/0 blur-2xl pointer-events-none" />

        <div className="relative grid items-center gap-8 p-8 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-12">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest">Pengaduan & Aspirasi Warga</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display italic tracking-tight leading-tight">
                Sampaikan Aspirasi Anda <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 not-italic">Secara Online</span>
              </h2>
              <p className="max-w-2xl text-base md:text-lg leading-relaxed text-slate-600 font-medium">
                Punya keluhan, saran, atau masukan untuk kemajuan Desa Pangawaren? 
                Sampaikan langsung secara online dan kami akan menindaklanjuti setiap laporan yang masuk secara terbuka.
              </p>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-700 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Aman & Terjamin
              </div>
              <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-700 shadow-xs">
                <Clock className="h-4 w-4 text-blue-500" />
                Ditindaklanjuti Cepat
              </div>
              <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-700 shadow-xs">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Analisis AI Otomatis
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-start gap-4 lg:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/30">
              <MessageSquareWarning className="h-9 w-9" />
            </div>
            <Link href="/pengaduan/" aria-label="Buat pengaduan warga">
              <Button className="h-12 rounded-full bg-gradient-to-r from-emerald-700 to-teal-700 px-7 text-xs font-black uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 shadow-xl shadow-emerald-700/25">
                Buat Pengaduan
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
