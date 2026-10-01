'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, Clock3 } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer className="relative z-10 bg-slate-950 text-slate-300 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm leading-7 text-slate-400">
              Portal resmi layanan masyarakat Desa Pangawaren yang menghubungkan warga dengan informasi, administrasi, dan pelayanan publik secara digital.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Tentang</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><Link href="/profil-desa/" className="transition-colors hover:text-white">Profil Desa</Link></li>
              <li><Link href="/pelayanan-desa/" className="transition-colors hover:text-white">Pelayanan Desa</Link></li>
              <li><Link href="/statistik/" className="transition-colors hover:text-white">Statistik</Link></li>
              <li><Link href="/desa-anti-korupsi/" className="transition-colors hover:text-white">Desa Anti Korupsi</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Kontak</h3>
            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span>Desa Pangawaren, Kecamatan Karangpucung, Cilacap</span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span>0851-1131-8412</span></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span>pemdespangawaren@gmail.com</span></li>
              <li className="flex gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span>Senin - Jumat, 08.00 - 16.00 WIB</span></li>
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end lg:text-right">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Media Sosial</h3>
            <div className="flex gap-3">
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-emerald-400 hover:text-white" aria-label="Facebook Desa Pangawaren">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/pemdespangawaren/" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-emerald-400 hover:text-white" aria-label="Instagram Desa Pangawaren">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@pemdes.pangawaren" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-emerald-400 hover:text-white" aria-label="TikTok Desa Pangawaren">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.82.94 1.93 1.63 3.16 2.01v3.74c-1.39-.02-2.77-.42-3.95-1.16-.72-.45-1.36-1.02-1.87-1.7v7.66c0 1.25-.26 2.47-.79 3.6-1.06 2.22-3.15 3.8-5.6 4.21-1.35.23-2.74.15-4.05-.24-2.26-.67-4.14-2.31-5.11-4.47-.6-1.34-.84-2.82-.7-4.29.28-2.9 2.06-5.46 4.81-6.42 1.27-.45 2.64-.5 3.94-.16v3.83c-.8-.28-1.68-.28-2.47.01-1.33.49-2.28 1.77-2.39 3.18-.12 1.63.89 3.16 2.46 3.51.68.15 1.39.11 2.05-.12.98-.35 1.72-1.19 1.92-2.2.06-.31.08-.63.08-.94V0h.02z"/>
                </svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-emerald-400 hover:text-white" aria-label="YouTube Desa Pangawaren">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
          <div className="text-sm text-slate-500">
            © 2026 Pemerintah Desa Pangawaren. Semua hak cipta dilindungi.
          </div>
          <div className="text-xs text-slate-600">
            Kecamatan Karangpucung, Kabupaten Cilacap, Jawa Tengah
          </div>
        </div>
      </div>
    </footer>
  );
}
