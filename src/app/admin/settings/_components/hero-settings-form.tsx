
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroImageInfo {
  imageUrl: string;
}

export function HeroSettingsForm() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const firestore = useFirestore();

  const heroRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'heroImage', 'default');
  }, [firestore]);

  const { data: heroData, isLoading: isDataLoading } = useDoc<HeroImageInfo>(heroRef);

  useEffect(() => {
    if (heroData?.imageUrl) {
      setImageUrl(heroData.imageUrl);
      setImagePreview(heroData.imageUrl);
    }
  }, [heroData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 700KB limit for Firestore document size
    if (file.size > 700 * 1024) { 
        toast({
            title: "Ukuran File Terlalu Besar",
            description: "Ukuran gambar hero tidak boleh melebihi 700KB.",
            variant: "destructive",
        });
        return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
      setImagePreview(base64String);
      setIsUploading(false);
      toast({ title: "Gambar Siap", description: "Klik simpan untuk menerapkan ke beranda." });
    };

    reader.onerror = () => {
        toast({ title: "Gagal Membaca File", variant: "destructive" });
        setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !heroRef) return;
    setIsSaving(true);

    try {
      await setDoc(heroRef, { imageUrl }, { merge: true });
      toast({
        title: "Berhasil",
        description: "Gambar utama beranda telah diperbarui.",
      });
    } catch (error) {
      console.error("Error saving hero image:", error);
      toast({
        title: "Gagal Menyimpan",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Gambar Utama Beranda (Hero)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Ganti gambar latar utama yang tampil di bagian atas halaman beranda website.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau Gambar Hero
              </Label>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Orientasi Lanskap (16:9)
              </span>
            </div>
            
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex items-center justify-center group shadow-inner">
              {imagePreview ? (
                <img src={imagePreview} alt="Hero Preview" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                  <ImageIcon className="h-8 w-8 stroke-1" />
                  <p className="text-xs font-medium">Belum ada gambar kustom. Menggunakan gambar default sistem.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-upload" className="text-xs font-bold text-slate-700">
              Pilih Berkas Gambar Baru
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="hero-upload"
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
                disabled={isSaving || isUploading}
                className="rounded-xl border-slate-200 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
              {isUploading && <Loader2 className="h-5 w-5 animate-spin text-emerald-600 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Format: JPG, PNG, atau WEBP. Ukuran file maksimal: <span className="font-bold text-slate-700">700 KB</span>.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <p className="text-xs text-slate-400 hidden sm:block">
              Perubahan langsung aktif di beranda
            </p>
            <Button
              type="submit"
              disabled={isSaving || isUploading || !imageUrl}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-md shadow-emerald-600/15 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Simpan Gambar Hero</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
