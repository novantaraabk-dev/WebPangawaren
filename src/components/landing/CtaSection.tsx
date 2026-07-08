'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-[2.25rem] border border-emerald-200 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 p-8 text-white shadow-[0_30px_80px_rgba(6,95,70,0.25)] sm:p-12"
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
              <Sparkles className="h-4 w-4" />
              Layanan Desa Modern
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Butuh pelayanan desa?
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-emerald-50/90">
              Ajukan seluruh pelayanan administrasi desa secara online melalui Portal Desa Pangawaren, cepat, aman, dan bisa diakses dari mana saja.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 text-emerald-50">
              <ShieldCheck className="h-6 w-6 text-amber-300" />
              <p className="text-lg font-semibold">Layanan resmi, transparan, dan terpercaya</p>
            </div>
            <Link href="/layanan-surat" aria-label="Ajukan layanan desa">
              <Button className="mt-8 h-12 rounded-full bg-amber-400 px-7 text-base font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300">
                Ajukan Layanan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
