'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload, User, Image as ImageIcon } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { VillageProfileInfo } from '@/lib/types';

export function AccompanyingImageSettingsForm() {
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profileData, isLoading: isDataLoading } = useDoc<VillageProfileInfo>(profileRef);

  useEffect(() => {
    if (profileData?.imageUrl) {
      setImageUrl(profileData.imageUrl);
      setImagePreview(profileData.imageUrl);
    }
  }, [profileData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: 'Ukuran File Terlalu Besar',
        description: 'Ukuran gambar pendamping tidak boleh melebihi 3MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal mengunggah gambar.');
      }

      const data = await res.json();
      setImageUrl(data.url);
      setImagePreview(data.url);

      toast({
        title: 'Gambar Terunggah ke Cloudinary',
        description: 'Pratinjau telah diperbarui. Klik "Simpan Gambar Pendamping" untuk menerapkan.',
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Gagal Mengunggah',
        description: error.message || 'Terjadi kesalahan saat mengunggah gambar ke Cloudinary.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !profileRef) return;
    setIsSaving(true);

    try {
      await setDoc(profileRef, { imageUrl }, { merge: true });
      toast({
        title: 'Gambar Pendamping Berhasil Disimpan',
        description: 'Gambar pendamping desa telah berhasil diperbarui.',
      });
    } catch (error) {
      console.error('Error saving accompanying image:', error);
      toast({
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan pengaturan ke Firestore.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return (
      <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden h-full">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <Skeleton className="h-8 w-1/2 rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded-lg mt-2" />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-11 w-48 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Gambar Pendamping (Tentang Desa)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Unggah gambar pendamping untuk bagian "Tentang Desa" di halaman beranda.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau Gambar Pendamping
              </Label>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Orientasi Lanskap (16:9)
              </span>
            </div>

            <div className="relative aspect-video w-full border-2 border-dashed border-slate-200 bg-slate-50/70 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner group">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Pratinjau Gambar Pendamping"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                  <ImageIcon className="h-8 w-8 stroke-1" />
                  <p className="text-xs font-medium">Belum ada gambar pendamping kustom.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accompanying-upload" className="text-xs font-bold text-slate-700">
              Pilih Berkas Baru
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="accompanying-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                disabled={isSaving || isUploading}
                className="rounded-xl border-slate-200 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
              />
              {isUploading && <Loader2 className="h-5 w-5 animate-spin text-teal-600 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Format: PNG, JPG, atau WEBP. Maksimal <span className="font-bold text-slate-700">3 MB</span>.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <p className="text-xs text-slate-400 hidden sm:block">
              Disimpan aman di Cloudinary
            </p>
            <Button
              type="submit"
              disabled={isSaving || isUploading || !imageUrl}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-md shadow-emerald-600/15 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Simpan Gambar Pendamping</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function PengaduanImageSettingsForm() {
  const [pengaduanImageUrl, setPengaduanImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profileData, isLoading: isDataLoading } = useDoc<VillageProfileInfo>(profileRef);

  useEffect(() => {
    if (profileData?.pengaduanImageUrl) {
      setPengaduanImageUrl(profileData.pengaduanImageUrl);
      setImagePreview(profileData.pengaduanImageUrl);
    }
  }, [profileData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: 'Ukuran File Terlalu Besar',
        description: 'Ukuran gambar pengaduan tidak boleh melebihi 3MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal mengunggah gambar.');
      }

      const data = await res.json();
      setPengaduanImageUrl(data.url);
      setImagePreview(data.url);

      toast({
        title: 'Gambar Terunggah ke Cloudinary',
        description: 'Pratinjau telah diperbarui. Klik "Simpan Gambar Pengaduan" untuk menerapkan.',
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Gagal Mengunggah',
        description: error.message || 'Terjadi kesalahan saat mengunggah gambar ke Cloudinary.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !profileRef) return;
    setIsSaving(true);

    try {
      await setDoc(profileRef, { pengaduanImageUrl }, { merge: true });
      toast({
        title: 'Gambar Pengaduan Berhasil Disimpan',
        description: 'Gambar Pengaduan Masyarakat telah berhasil diperbarui.',
      });
    } catch (error) {
      console.error('Error saving pengaduan image:', error);
      toast({
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan pengaturan ke Firestore.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return (
      <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden h-full">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <Skeleton className="h-8 w-1/2 rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded-lg mt-2" />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Skeleton className="aspect-[3/4] w-48 mx-auto rounded-2xl" />
          <Skeleton className="h-11 w-48 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Poster Pengaduan Masyarakat
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Gambar untuk kartu "Layanan Pengaduan" di landing page beranda desa.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau Poster Pengaduan
              </Label>
              <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Orientasi Tegak (3:4)
              </span>
            </div>

            <div className="w-full flex justify-center py-2">
              <div className="relative aspect-[3/4] w-48 border-2 border-dashed border-slate-200 bg-slate-50/70 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner group">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Pratinjau Gambar Pengaduan Masyarakat"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                    <Upload className="h-8 w-8 stroke-1 text-slate-400" />
                    <p className="text-xs font-medium">Belum ada gambar pengaduan.</p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-[11px] text-slate-400">Rasio ideal: 3:4 (contoh: 600 × 800 piksel)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pengaduan-upload" className="text-xs font-bold text-slate-700">
              Pilih Berkas Baru
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="pengaduan-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                disabled={isSaving || isUploading}
                className="rounded-xl border-slate-200 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
              />
              {isUploading && <Loader2 className="h-5 w-5 animate-spin text-rose-600 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Format: PNG, JPG, atau WEBP. Maksimal <span className="font-bold text-slate-700">3 MB</span>.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <p className="text-xs text-slate-400 hidden sm:block">
              Disimpan aman di Cloudinary
            </p>
            <Button
              type="submit"
              disabled={isSaving || isUploading || !pengaduanImageUrl}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-md shadow-emerald-600/15 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Simpan Gambar Pengaduan</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function KadesPhotoSettingsForm() {
  const [kadesPhotoUrl, setKadesPhotoUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profileData, isLoading: isDataLoading } = useDoc<VillageProfileInfo>(profileRef);

  useEffect(() => {
    if (profileData?.kadesPhotoUrl) {
      setKadesPhotoUrl(profileData.kadesPhotoUrl);
      setImagePreview(profileData.kadesPhotoUrl);
    }
  }, [profileData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: 'Ukuran File Terlalu Besar',
        description: 'Ukuran foto Kepala Desa tidak boleh melebihi 3MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal mengunggah foto.');
      }

      const data = await res.json();
      setKadesPhotoUrl(data.url);
      setImagePreview(data.url);

      toast({
        title: 'Foto Terunggah ke Cloudinary',
        description: 'Pratinjau telah diperbarui. Klik "Simpan Foto Kades" untuk menerapkan.',
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Gagal Mengunggah',
        description: error.message || 'Terjadi kesalahan saat mengunggah foto ke Cloudinary.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !profileRef) return;
    setIsSaving(true);

    try {
      await setDoc(profileRef, { kadesPhotoUrl }, { merge: true });
      toast({
        title: 'Foto Kades Berhasil Disimpan',
        description: 'Foto Kepala Desa telah berhasil diperbarui.',
      });
    } catch (error) {
      console.error('Error saving kades photo:', error);
      toast({
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan pengaturan ke Firestore.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return (
      <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden h-full">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <Skeleton className="h-8 w-1/2 rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded-lg mt-2" />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Skeleton className="aspect-[3/4] w-48 mx-auto rounded-2xl" />
          <Skeleton className="h-11 w-48 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Foto Resmi Kepala Desa
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Foto Kepala Desa untuk bagian "Profil & Sambutan" pada Profil Desa.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau Foto Kepala Desa
              </Label>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Orientasi Tegak (3:4)
              </span>
            </div>

            <div className="w-full flex justify-center py-2">
              <div className="relative aspect-[3/4] w-48 border-2 border-dashed border-slate-200 bg-slate-50/70 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner group">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Pratinjau Foto Kades"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                    <User className="h-8 w-8 stroke-1 text-slate-400" />
                    <p className="text-xs font-medium">Belum ada foto Kepala Desa.</p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-[11px] text-slate-400">Rasio ideal: 3:4 (foto resmi pose formal)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kades-upload" className="text-xs font-bold text-slate-700">
              Pilih Foto Baru
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="kades-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                disabled={isSaving || isUploading}
                className="rounded-xl border-slate-200 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
              />
              {isUploading && <Loader2 className="h-5 w-5 animate-spin text-amber-600 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Format: PNG, JPG, atau WEBP. Maksimal <span className="font-bold text-slate-700">3 MB</span>.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <p className="text-xs text-slate-400 hidden sm:block">
              Disimpan aman di Cloudinary
            </p>
            <Button
              type="submit"
              disabled={isSaving || isUploading || !kadesPhotoUrl}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-md shadow-emerald-600/15 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Simpan Foto Kades</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
