
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SettingsForm } from './_components/settings-form';
import { LogoSettingsForm } from './_components/logo-settings-form';
import { HeroSettingsForm } from './_components/hero-settings-form';
import { DriveSettingsForm } from './_components/drive-settings-form';
import { VideoProfileSettingsForm } from './_components/video-profile-settings-form';
import { FooterLogosSettingsForm } from './_components/footer-logos-settings-form';
import { AccompanyingImageSettingsForm, KadesPhotoSettingsForm, PengaduanImageSettingsForm } from './_components/cloudinary-images-form';
import { DesaAntiKorupsiDriveForm } from './_components/desa-anti-korupsi-drive-form';
import {
  Image as ImageIcon,
  FileText,
  Cloud,
  Building2,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('visual');

  return (
    <div className="space-y-8 pb-20">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <PageHeader
          title="Pengaturan Sistem"
          description="Kelola identitas visual desa, templat dokumen cetak, konfigurasi Google Drive, dan logo kemitraan footer."
          className="mb-0"
        />
        
        {/* Status Pill Badge */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-600 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Konfigurasi Aktif</span>
        </div>
      </div>

      {/* Tabs Navigation Desktop & Mobile */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-slate-100/90 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1 border border-slate-200/80 shadow-inner">
            <TabsTrigger
              value="visual"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Identitas & Media</span>
            </TabsTrigger>
            
            <TabsTrigger
              value="surat"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>Kop Dokumen</span>
            </TabsTrigger>

            <TabsTrigger
              value="storage"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              <Cloud className="h-4 w-4" />
              <span>Google Drive</span>
            </TabsTrigger>

            <TabsTrigger
              value="mitra"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              <Building2 className="h-4 w-4" />
              <span>Logo Mitra Footer</span>
            </TabsTrigger>

            <TabsTrigger
              value="semua"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
            >
              <Layers className="h-4 w-4" />
              <span>Tampilkan Semua</span>
            </TabsTrigger>
          </TabsList>

          <p className="text-xs text-slate-400 hidden xl:block">
            Pilih kategori untuk memfokuskan pengaturan layar
          </p>
        </div>

        {/* TAB 1: IDENTITAS & MEDIA BERANDA */}
        <TabsContent value="visual" className="space-y-8 mt-0 focus-visible:outline-hidden">
          {/* Baris 1: Hero Image (16:9) + Video Profile (16:9 with YouTube Player Preview) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
            <HeroSettingsForm />
            <VideoProfileSettingsForm />
          </div>

          {/* Baris 2: Foto Kades (3:4) + Poster Pengaduan (3:4) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <KadesPhotoSettingsForm />
            <PengaduanImageSettingsForm />
          </div>

          {/* Baris 3: Logo Desa (Square) + Gambar Pendamping (Landscape) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <LogoSettingsForm />
            <AccompanyingImageSettingsForm />
          </div>
        </TabsContent>

        {/* TAB 2: TEMPLAT DOKUMEN & KOP SURAT */}
        <TabsContent value="surat" className="space-y-8 mt-0 focus-visible:outline-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-2">
              <SettingsForm />
            </div>

            {/* Petunjuk Format Kop Surat */}
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <span>Panduan Templat Kop Resmi</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ukuran Rekomendasi:</strong> Gunakan lebar 1200 piksel dengan tinggi 240 piksel agar proporsional di kertas A4 dan F4.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Kelengkapan Kop:</strong> Pastikan memuat logo resmi Kabupaten Cilacap, nama instansi, alamat kantor desa lengkap, kode pos, dan garis pemisah ganda.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Format Berkas:</strong> PNG dengan transparansi atau latar belakang putih bersih (maksimal 700 KB).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: PENYIMPANAN CLOUD & DRIVE */}
        <TabsContent value="storage" className="space-y-8 mt-0 focus-visible:outline-hidden">
          <div className="space-y-8">
            <DriveSettingsForm />
            <DesaAntiKorupsiDriveForm />
          </div>
        </TabsContent>

        {/* TAB 4: LOGO MITRA & FOOTER */}
        <TabsContent value="mitra" className="space-y-8 mt-0 focus-visible:outline-hidden">
          <FooterLogosSettingsForm />
        </TabsContent>

        {/* TAB 5: SEMUA PENGATURAN (ALL IN ONE) */}
        <TabsContent value="semua" className="space-y-12 mt-0 focus-visible:outline-hidden">
          {/* Section 1: Media Beranda */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                  Identitas Visual & Media Beranda
                </h3>
                <p className="text-xs text-slate-500">Banner hero, video profil, foto kades, pengaduan, dan logo desa.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
              <HeroSettingsForm />
              <VideoProfileSettingsForm />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <KadesPhotoSettingsForm />
              <PengaduanImageSettingsForm />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <LogoSettingsForm />
              <AccompanyingImageSettingsForm />
            </div>
          </div>

          {/* Section 2: Templat Dokumen */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                  Templat Persuratan & Dokumen
                </h3>
                <p className="text-xs text-slate-500">Format kop surat resmi untuk pencetakan dokumen PDF.</p>
              </div>
            </div>

            <SettingsForm />
          </div>

          {/* Section 3: Cloud Drive */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="h-8 w-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                  Integrasi Google Drive & Cloud
                </h3>
                <p className="text-xs text-slate-500">Penyimpanan berkas surat warga dan bukti sub-menu anti-korupsi.</p>
              </div>
            </div>

            <DriveSettingsForm />
            <DesaAntiKorupsiDriveForm />
          </div>

          {/* Section 4: Logo Mitra Footer */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                  Logo Mitra & Instansi Footer
                </h3>
                <p className="text-xs text-slate-500">Daftar logo instansi yang tampil di atas footer halaman depan.</p>
              </div>
            </div>

            <FooterLogosSettingsForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
