'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemoFirebase, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContourPattern } from './CardContourPattern';

export function SambutanSection() {
  const firestore = useFirestore();
  const kadesRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: kadesData } = useDoc<{ imageUrl?: string }>(kadesRef);
  const imageUrl = kadesData?.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600';

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid items-stretch gap-10 lg:grid-cols-12">
        {/* Foto Kades */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -6, scale: 1.01 }}
          className="lg:col-span-4 flex justify-center"
        >
          <Card className="w-full max-w-[340px] rounded-[2.5rem] overflow-hidden border border-emerald-100 bg-white shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col group relative">
            <CardContourPattern opacity={0.03} className="text-emerald-600" />
            <div className="aspect-[3/4] relative bg-slate-100 flex-grow overflow-hidden z-10">
              <Image
                src={imageUrl}
                alt="Foto Kepala Desa Pangawaren"
                fill
                sizes="(max-w-768px) 100vw, 340px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-800 shadow-md">
                Kepala Desa
              </div>
            </div>
            <div className="p-6 text-center bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white relative z-10">
              <CardContourPattern opacity={0.03} className="text-emerald-200" />
              <h3 className="text-xl font-black uppercase tracking-tight font-display italic">SUHUD</h3>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] mt-1">Pemerintah Desa Pangawaren</p>
            </div>
          </Card>
        </motion.div>

        {/* Narasi Sambutan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 flex flex-col justify-center space-y-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full mb-3 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest">Sambutan Kepala Desa</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display italic tracking-tight leading-tight">
              Melayani Dengan Hati, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 not-italic">Membangun Dengan Inovasi</span>
            </h2>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-base md:text-lg leading-relaxed text-slate-600 font-medium italic border-l-4 border-amber-500 pl-4 py-2 bg-amber-50/50 rounded-r-2xl border-y border-r border-amber-100/50">
              "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi digital Desa Pangawaren. Website ini adalah perwujudan dari visi kami untuk menciptakan transparansi dan kemudahan layanan bagi seluruh warga."
            </p>
            <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              Di era transformasi digital ini, kecepatan informasi dan kemudahan akses layanan adalah kunci kemajuan wilayah. Kami menghadirkan sistem layanan mandiri ini agar warga dapat mengurus berbagai kebutuhan administrasi dari mana saja secara cepat dan terbuka.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {["Transparansi", "Efisiensi", "Digitalisasi Mandiri"].map(tag => (
              <div key={tag} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-800 shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" /> {tag}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/profil-desa" aria-label="Baca selengkapnya tentang profil desa">
              <Button className="h-12 rounded-full bg-gradient-to-r from-emerald-700 to-teal-700 px-7 font-black text-white uppercase text-xs tracking-wider transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-700/20">
                Profil Selengkapnya
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
