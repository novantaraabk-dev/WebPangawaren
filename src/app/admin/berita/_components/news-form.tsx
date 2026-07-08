'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Image as ImageIcon, Sparkles, Star, Video } from 'lucide-react';
import { doc, setDoc, addDoc, collection, serverTimestamp, writeBatch, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { News } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { generateVillageNewsDraft } from '@/ai/flows/generate-village-news-flow';
import { getVideoEmbedUrl } from '@/lib/video-utils';

interface NewsFormProps {
  initialData?: News | null;
}

const CLOUD_NAME = 'dgsxujjb1';
const UPLOAD_PRESET = 'webdesa'; 

export function NewsForm({ initialData }: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: '',
    content: '',
    author: '',
    imageUrl: '', // Cloudinary URL for photo news
    videoUrl: '',
    mediaType: 'photo' as 'photo' | 'video',
    isHeadline: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title ?? '',
        subtitle: initialData.subtitle ?? '',
        date: initialData.date ?? '',
        content: initialData.content ?? '',
        author: initialData.author ?? '',
        imageUrl: initialData.imageUrl ?? '',
        videoUrl: initialData.videoUrl ?? '',
        mediaType: initialData.mediaType ?? (initialData.videoUrl ? 'video' : 'photo'),
        isHeadline: initialData.isHeadline ?? false,
      });
    }
  }, [initialData]);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (typeof dataUrl !== 'string') {
          reject(new Error('Gagal membaca file gambar.'));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDimension = 1600;
          let { width, height } = img;

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Tidak dapat memproses gambar.'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          const tryCompress = (quality: number, attempt: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Gagal mengompresi gambar.'));
                  return;
                }

                const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });

                if (compressedFile.size > 700 * 1024 && attempt < 4) {
                  tryCompress(Math.max(0.55, quality - 0.15), attempt + 1);
                } else {
                  resolve(compressedFile);
                }
              },
              'image/jpeg',
              quality
            );
          };

          tryCompress(0.9, 1);
        };
        img.onerror = () => reject(new Error('Gambar tidak valid.'));
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();

    try {
      const processingFile = await compressImage(file);
      uploadFormData.append('file', processingFile);
      uploadFormData.append('upload_preset', UPLOAD_PRESET);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || 'Gagal mengunggah ke Cloudinary');
      }

      setFormData(prev => ({ ...prev, imageUrl: data.secure_url }));
      toast({ title: 'Unggah Berhasil', description: 'Gambar berhasil dikompresi dan diunggah ke Cloudinary.' });
    } catch (error: any) {
      let description = error.message;
      if (error instanceof SyntaxError) {
        description = 'Respons dari server tidak valid. Ini bisa terjadi karena kesalahan konfigurasi pada Cloudinary (misal: nama preset salah atau preset tidak diatur ke unsigned). Periksa kembali pengaturan Anda.';
      }

      toast({
        title: 'Gagal Mengunggah',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isVideoNews = formData.mediaType === 'video';

  const handleGenerateWithAI = async () => {
    if (!formData.title.trim() && !formData.subtitle.trim()) {
      toast({
        title: 'Data belum lengkap',
        description: 'Isi judul kegiatan atau sub judul terlebih dahulu agar AI bisa membuat draft berita.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const draft = await generateVillageNewsDraft({
        title: formData.title || 'Kegiatan Desa',
        subtitle: formData.subtitle || 'Kegiatan masyarakat desa',
        date: formData.date || 'Tanggal berita',
        author: formData.author || 'Tim Media Desa',
      });

      setFormData(prev => ({ ...prev, content: formatNewsContent(draft.content) }));
      toast({
        title: 'Draft berita berhasil dibuat',
        description: 'Isi berita telah diisi otomatis oleh Gemini sesuai judul dan tanggal yang Anda masukkan.',
      });
    } catch (error: any) {
      toast({
        title: 'Gagal membuat berita AI',
        description: error.message || 'Pastikan API Gemini sudah tersedia di lingkungan ini.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    if (formData.imageUrl && !formData.imageUrl.includes('res.cloudinary.com')) {
      toast({
        title: 'URL Gambar tidak valid',
        description: 'Harap unggah ulang gambar untuk mendapatkan URL Cloudinary yang benar.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.mediaType === 'video' && !getVideoEmbedUrl(formData.videoUrl)) {
      toast({
        title: 'URL Video tidak valid',
        description: 'Harap masukkan tautan TikTok, Instagram, atau YouTube yang benar.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSave = {
        title: formData.title,
        subtitle: formData.subtitle,
        date: formData.date,
        author: formData.author,
        isHeadline: formData.isHeadline,
        mediaType: formData.mediaType,
        imageUrl: formData.imageUrl,
        videoUrl: formData.mediaType === 'video' ? formData.videoUrl : '',
        content: formData.content ? formatNewsContent(formData.content) : '',
      };

      if (initialData) {
        const batch = writeBatch(firestore);
        if (dataToSave.isHeadline) {
          const headlineQuery = query(collection(firestore, 'news'), where('isHeadline', '==', true));
          const headlineSnapshot = await getDocs(headlineQuery);
          headlineSnapshot.docs.forEach((docSnapshot) => {
            if (docSnapshot.id !== initialData.id) {
              batch.update(doc(firestore, 'news', docSnapshot.id), { isHeadline: false, updatedAt: serverTimestamp() });
            }
          });
        }
        batch.set(doc(firestore, 'news', initialData.id), {
          ...dataToSave,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        await batch.commit();
        toast({ title: 'Berhasil Diperbarui' });
      } else {
        if (dataToSave.isHeadline) {
          const batch = writeBatch(firestore);
          const headlineQuery = query(collection(firestore, 'news'), where('isHeadline', '==', true));
          const headlineSnapshot = await getDocs(headlineQuery);
          headlineSnapshot.docs.forEach((docSnapshot) => {
            batch.update(doc(firestore, 'news', docSnapshot.id), { isHeadline: false, updatedAt: serverTimestamp() });
          });
          const newDocRef = doc(collection(firestore, 'news'));
          batch.set(newDocRef, {
            ...dataToSave,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          await batch.commit();
        } else {
          await addDoc(collection(firestore, 'news'), {
            ...dataToSave,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        toast({ title: 'Berita Berhasil Dibuat' });
      }
      router.push('/admin/berita');
    } catch (error: any) {
      toast({ title: 'Gagal Menyimpan', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNewsContent = (rawContent: string) => {
    return rawContent
      .split(/\n\s*\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .join('\n\n');
  };

  const getOptimizedImageUrl = (url: string) => {
      if (!url.includes('res.cloudinary.com')) return url;
      const transformation = 'w_800,q_auto,f_auto';
      return url.replace('/image/upload/', `/image/upload/${transformation}/`);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Berita' : 'Buat Berita Baru'}</CardTitle>
        <CardDescription>Lengkapi informasi berita kegiatan desa di bawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-4">
              <Label>Jenis Berita</Label>
              <Tabs
                value={formData.mediaType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, mediaType: value as 'photo' | 'video' }))}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 gap-2 rounded-3xl border p-1">
                  <TabsTrigger value="photo">Berita Foto</TabsTrigger>
                  <TabsTrigger value="video">Berita Video</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {formData.mediaType === 'photo'
                    ? 'Pilih tab Foto untuk unggah gambar berita.'
                    : 'Pilih tab Video untuk masukkan tautan video berita.'}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {formData.mediaType === 'photo'
                    ? 'Foto akan ditampilkan sebagai media utama berita.'
                    : 'Video akan diputar langsung di halaman berita.'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{formData.mediaType === 'photo' ? 'Gambar Kegiatan' : 'Preview Gambar Video'}</Label>
              <div className="flex flex-col gap-4">
                {formData.mediaType === 'photo' ? (
                  <>
                    {formData.imageUrl && (
                      <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-muted">
                        <img src={getOptimizedImageUrl(formData.imageUrl)} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading || isSubmitting} className="max-w-xs" />
                      {isUploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Format JPG/PNG. Sistem akan otomatis mengompresi gambar sebelum diunggah ke Cloudinary.</p>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Input
                        type="url"
                        value={formData.videoUrl ?? ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=..."
                        disabled={isSubmitting}
                        required
                      />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">
                        Dapat menggunakan link YouTube, TikTok, atau Instagram.
                      </p>
                    </div>
                    {formData.imageUrl && (
                      <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border bg-muted">
                        <img src={getOptimizedImageUrl(formData.imageUrl)} alt="Preview Video" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading || isSubmitting} className="max-w-xs" />
                      {isUploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">
                      Upload gambar preview untuk ditampilkan di kartu berita video.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 p-4 rounded-xl border border-amber-100">
            <Checkbox 
              id="isHeadline" 
              checked={formData.isHeadline} 
              onCheckedChange={(checked) => setFormData(p => ({ ...p, isHeadline: !!checked }))}
            />
            <Label htmlFor="isHeadline" className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              Tandai sebagai Berita Headline (Utama)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Kegiatan (Maskot)</Label>
            <Input 
              id="title" 
              value={formData.title ?? ''} 
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} 
              placeholder="Contoh: Musyawarah Desa Pangawaren 2026"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Sub Judul</Label>
            <Input 
              id="subtitle" 
              value={formData.subtitle ?? ''} 
              onChange={e => setFormData(p => ({ ...p, subtitle: e.target.value }))} 
              placeholder="Ringkasan singkat berita..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal Berita</Label>
            <Input 
              id="date" 
              value={formData.date ?? ''} 
              onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} 
              placeholder="Contoh: Jumat, 24 Apr 2026"
              required 
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="content">Isi Berita</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateWithAI}
                disabled={isGenerating || isSubmitting || isUploading}
                className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
              >
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Buat dengan AI
              </Button>
            </div>
            <Textarea 
              id="content" 
              value={formData.content ?? ''} 
              onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} 
              placeholder="Tulis narasi lengkap berita di sini..."
              rows={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Pembuat Berita</Label>
            <Input 
              id="author" 
              value={formData.author ?? ''} 
              onChange={e => setFormData(p => ({ ...p, author: e.target.value }))} 
              placeholder="Nama Penulis / Tim Media Desa"
              required 
            />
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting || isUploading} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Berita
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
