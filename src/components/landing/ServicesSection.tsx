'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users2 as Users, 
  Landmark as Building2, 
  MapPin, 
  Megaphone, 
  MessageSquareWarning, 
  ArrowRight,
  Info
} from 'lucide-react';
import { CardContourPattern } from './CardContourPattern';

const services = [
  {
    title: 'Layanan Surat Online',
    description: 'Permohonan surat keterangan dan dokumen kependudukan resmi desa secara praktis.',
    icon: FileText,
    href: '/layanan-surat',
  },
  {
    title: 'Data Kependudukan',
    description: 'Informasi dan statistik agregat demografi serta komposisi warga desa.',
    icon: Users,
    href: '/tata-kelola-desa',
  },
  {
    title: 'Tata Kelola & APBDes',
    description: 'Transparansi anggaran pendapatan, belanja desa, dan laporan keuangan wilayah.',
    icon: Building2,
    href: '/tata-kelola-desa',
  },
  {
    title: 'Potensi Desa Pangawaren',
    description: 'Jelajahi potensi wisata, UMKM lokal, pertanian, dan kekayaan seni budaya desa.',
    icon: MapPin,
    href: '/potensi-desa',
  },
  {
    title: 'Berita & Pengumuman',
    description: 'Pusat publikasi kabar terkini, kegiatan pemerintah, dan agenda resmi warga.',
    icon: Megaphone,
    href: '/BeritaDesa',
  },
  {
    title: 'Pengaduan Warga',
    description: 'Sampaikan aspirasi, saran, atau laporan secara terbuka dan mudah dipantau.',
    icon: MessageSquareWarning,
    href: '/pengaduan',
  },
];

export function ServicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full mb-3 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest">Portal Layanan Utama</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display italic tracking-tight leading-tight">
            Layanan Digital Desa <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 not-italic">Cepat & Transparan</span>
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-600 font-medium">
            Seluruh pelayanan desa dapat dijangkau secara mandiri dan transparan melalui portal digital yang dirancang khusus untuk kemudahan masyarakat.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full lg:max-w-md shrink-0"
        >
          <div className="relative overflow-hidden p-5 bg-gradient-to-br from-amber-50 to-orange-50/60 border border-dashed border-amber-300 rounded-[2.25rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
             <CardContourPattern opacity={0.03} className="text-amber-600" />
             <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-2xl shadow-md shadow-amber-500/20 shrink-0 relative z-10">
                <Info className="h-6 w-6" />
             </div>
             <div className="space-y-0.5 relative z-10">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">Transparansi Biaya Admin</h3>
                <p className="text-xs leading-relaxed font-semibold text-amber-800">
                   Seluruh pelayanan administrasi di Desa Pangawaren adalah <strong className="text-amber-950 font-black underline">GRATIS (Rp. 0,-)</strong> tanpa biaya tambahan apapun.
                </p>
             </div>
          </div>
        </motion.div>
      </div>


      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2.25rem] border border-slate-100 bg-white p-8 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <CardContourPattern opacity={0.03} className="text-slate-400 group-hover:text-emerald-500 transition-colors duration-500" />
              
              {/* Glowing Corner Accent */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:from-emerald-500/20" />
              
              {/* Subtle Dot Grid pattern */}
              <div className="absolute right-6 top-6 text-slate-200 transition-colors duration-300 group-hover:text-emerald-300/40 pointer-events-none">
                <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
                  <pattern id={`card-dots-${index}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="currentColor" />
                  </pattern>
                  <rect width="40" height="40" fill={`url(#card-dots-${index})`} />
                </svg>
              </div>

              <Link href={service.href} className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-slate-900 font-display italic tracking-tight transition-colors group-hover:text-emerald-700">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 group-hover:underline">
                    Akses Halaman
                  </span>
                  <div className="h-9 w-9 rounded-full bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 shadow-sm">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
