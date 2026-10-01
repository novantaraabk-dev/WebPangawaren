'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FileText } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { KopSuratInfo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const defaultKopInfo: KopSuratInfo = {
  letterheadImageUrl: "https://placehold.co/1200x240/f0f0f0/333333?text=Unggah+Gambar+Kop+Surat"
};

export function SettingsForm() {
  const [formState, setFormState] = useState<KopSuratInfo>(defaultKopInfo);
  const [imagePreview, setImagePreview] = useState<string>(defaultKopInfo.letterheadImageUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const firestore = useFirestore();

  const kopSuratRef = useMemoFirebase(() => doc(firestore, 'kopSurat', 'default'), [firestore]);
  const { data: kopData, isLoading: isDataLoading } = useDoc<KopSuratInfo>(kopSuratRef);

  useEffect(() => {
    if (kopData) {
      setFormState(kopData);
      setImagePreview(kopData.letterheadImageUrl);
    }
  }, [kopData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 700KB limit to avoid hitting Firestore's 1MiB document size limit after base64 encoding.
    if (file.size > 700 * 1024) { 
        toast({
            title: "Ukuran File Terlalu Besar",
            description: "Ukuran gambar kop surat tidak boleh melebihi 700KB.",
            variant: "destructive",
        });
        return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormState({ letterheadImageUrl: base64String });
      setImagePreview(base64String);
      setIsUploading(false);
      toast({ title: "Gambar Siap Disimpan", description: "Pratinjau telah diperbarui. Klik 'Simpan Kop Surat' untuk menerapkan." });
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
    setIsSaving(true);

    try {
      await setDoc(kopSuratRef, formState, { merge: true });
      toast({
        title: "Templat Kop Berhasil Diperbarui",
        description: "Gambar kop surat telah berhasil disimpan.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan ke Firestore.",
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
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-11 w-48 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Templat Kop Surat Resmi
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Unggah gambar kop surat siap pakai yang akan otomatis tercetak di bagian atas seluruh surat pelayanan.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau Kop Surat Dokumen
              </Label>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Format Standar Cetak A4 / F4
              </span>
            </div>

            <div className="p-4 sm:p-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50/70 min-h-44 shadow-inner">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Pratinjau Kop Surat"
                  className="object-contain max-h-44 w-auto rounded-lg shadow-xs bg-white border border-slate-200/60 p-1"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                  <FileText className="h-8 w-8 stroke-1 text-slate-400" />
                  <p className="text-xs font-medium">Belum ada gambar kop surat kustom.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kop-upload" className="text-xs font-bold text-slate-700">
              Unggah Berkas Gambar Kop Surat Baru
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="kop-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                disabled={isSaving || isUploading}
                className="rounded-xl border-slate-200 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              {isUploading && <Loader2 className="h-5 w-5 animate-spin text-indigo-600 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Format: PNG atau JPG. Ukuran ideal ~1200 × 240 px. Maksimal <span className="font-bold text-slate-700">700 KB</span>.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <p className="text-xs text-slate-400 hidden sm:block">
              Digunakan saat cetak PDF surat
            </p>
            <Button
              type="submit"
              disabled={isSaving || isUploading || !formState.letterheadImageUrl || formState.letterheadImageUrl === defaultKopInfo.letterheadImageUrl}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-md shadow-emerald-600/15 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Simpan Kop Surat</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
