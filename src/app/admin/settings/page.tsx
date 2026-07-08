
'use client';

import { PageHeader } from '@/components/page-header';
import { SettingsForm } from './_components/settings-form';
import { LogoSettingsForm } from './_components/logo-settings-form';
import { HeroSettingsForm } from './_components/hero-settings-form';
import { DriveSettingsForm } from './_components/drive-settings-form';
import { VideoProfileSettingsForm } from './_components/video-profile-settings-form';
import { FooterLogosSettingsForm } from './_components/footer-logos-settings-form';
import { AccompanyingImageSettingsForm, KadesPhotoSettingsForm } from './_components/cloudinary-images-form';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10 pb-20">
      <PageHeader
        title="Pengaturan Sistem"
        description="Kelola identitas visual desa, templat dokumen, dan konfigurasi penyimpanan awan."
      />
      
      <div className="grid gap-10">
        <HeroSettingsForm />
        <VideoProfileSettingsForm />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <AccompanyingImageSettingsForm />
            <KadesPhotoSettingsForm />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <LogoSettingsForm />
            <DriveSettingsForm />
        </div>
        <FooterLogosSettingsForm />
        <SettingsForm />
      </div>
    </div>
  );
}
