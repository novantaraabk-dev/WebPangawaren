'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Landmark } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { VillageLogoInfo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const defaultLogoInfo: VillageLogoInfo = {
  logoImageUrl: "" // Start with no logo
};

export function LogoSettingsForm() {
  const [formState, setFormState] = useState<VillageLogoInfo>(defaultLogoInfo);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const firestore = useFirestore();

  const logoRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return doc(firestore, 'villageLogo', 'default');
  }, [firestore]);
  const { data: logoData, isLoading: isDataLoading } = useDoc<VillageLogoInfo>(logoRef);

  useEffect(() => {
    if (logoData) {
      setFormState(logoData);
      setImagePreview(logoData.logoImageUrl);
    }
  }, [logoData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024) { 
        toast({
            title: "Ukuran File Terlalu Besar",
            description: "Ukuran gambar logo tidak boleh melebihi 100KB.",
            variant: "destructive",
        });
        return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormState({ logoImageUrl: base64String });
      setImagePreview(base64String);
      setIsUploading(false);
      toast({ title: "Logo Siap Disimpan", description: "Pratinjau telah diperbarui. Klik 'Simpan Perubahan' untuk menerapkan." });
    };

    reader.onerror = () => {
        console.error("Error reading file");
        toast({ title: "Gagal Membaca File", description: "Terjadi kesalahan saat memuat pratinjau gambar.", variant: "destructive" });
        setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !logoRef) return;
    setIsSaving(true);

    try {
      await setDoc(logoRef, formState, { merge: true });
      toast({
        title: "Logo Berhasil Diperbarui",
        description: "Logo desa telah berhasil disimpan.",
      });
    } catch (error) {
      console.error("Error saving logo:", error);
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan logo ke Firestore.",
        variant: "destructive",
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
          <Skeleton className="h-28 w-28 rounded-2xl" />
          <Skeleton className="h-11 w-48 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Logo Resmi Desa Pangawaren
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Logo resmi desa yang tampil pada header navigasi dan identitas portal.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau Logo
              </Label>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Format Transparan (PNG / SVG)
              </span>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70">
              <div className="relative w-28 h-28 p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Pratinjau Logo"
                    width={90}
                    height={90}
                    className="object-contain max-h-full w-auto"
                  />
                ) : (
                  <p className="text-[11px] text-slate-400 text-center font-medium">Belum ada logo</p>
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">Identitas Visual Resmi</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Gunakan gambar logo dengan latar belakang transparan agar serasi dengan navbar dan kop surat.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo-upload" className="text-xs font-bold text-slate-700">
              Unggah Berkas Logo Baru
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="logo-upload"
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleFileChange}
                disabled={isSaving || isUploading}
                className="rounded-xl border-slate-200 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {isUploading && <Loader2 className="h-5 w-5 animate-spin text-blue-600 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Format: PNG, JPG, atau SVG. Ukuran maksimal: <span className="font-bold text-slate-700">100 KB</span>.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <p className="text-xs text-slate-400 hidden sm:block">
              Tampil di header seluruh halaman
            </p>
            <Button
              type="submit"
              disabled={isSaving || isUploading || !formState.logoImageUrl}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-md shadow-emerald-600/15 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Simpan Logo Desa</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
