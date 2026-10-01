'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, MessageSquareWarning } from 'lucide-react';
import { ComplaintSystem } from '@/app/(main)/pengaduan/_components/complaint-system';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

export default function PengaduanPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
             <Link href="/">
                <Button variant="ghost" className="font-bold gap-2 text-primary hover:bg-slate-100 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Beranda</span>
                </Button>
            </Link>
            <Link href="/layanan-surat/">
                <Button className="bg-secondary hover:bg-yellow-600 text-primary-foreground font-black px-6 rounded-xl shadow-lg shadow-secondary/20 h-10">Portal Layanan</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* PAGE HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 shrink-0">
              <MessageSquareWarning className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 font-display">
                Pengaduan Warga
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Sampaikan keluhan dan masukan Anda untuk kemajuan Desa Pangawaren.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/6285111318412?text=Halo%20Admin%20Pelayanan%20Desa%20Pangawaren%2C%20saya%20ingin%20menyampaikan%20pengaduan."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-95 group w-fit"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <WhatsAppIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                Pengaduan via WhatsApp
              </div>
              <div className="text-sm font-black flex items-center gap-1.5">
                <span>0851-1131-8412</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </a>
        </div>

        {/* CONTENT */}
        <ComplaintSystem />
      </div>
    </div>
  );
}
