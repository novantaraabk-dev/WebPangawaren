'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { FooterLogosInfo, PartnerLogoItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const CLOUD_NAME = 'dgsxujjb1';
const UPLOAD_PRESET = 'webdesa';

interface LogoCardProps {
  item: PartnerLogoItem;
  index: number;
  total: number;
  isUploading: boolean;
  onUpload: (file: File, id: string) => Promise<void>;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onChangeName: (id: string, name: string) => void;
  onChangeLink: (id: string, link: string) => void;
}

function LogoCard({
  item,
  index,
  total,
  isUploading,
  onUpload,
  onRemove,
  onMoveUp,
  onMoveDown,
  onChangeName,
  onChangeLink,
}: LogoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUpload(file, item.id);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:shadow-md">
      <div className="space-y-3">
        {/* Header: Badge & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-extrabold text-emerald-800">
              {index + 1}
            </span>
            <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
              {item.name || `Logo ${index + 1}`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              title="Geser ke kiri / atas"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === total - 1}
              title="Geser ke kanan / bawah"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              title="Hapus logo"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors ml-0.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Logo Preview Box */}
        <div className="relative flex h-28 w-full items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 overflow-hidden">
          {item.url ? (
            <Image
              src={item.url}
              alt={item.name || `Logo ${index + 1}`}
              width={160}
              height={90}
              className="max-h-full w-auto object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-slate-400">
              <Upload className="h-6 w-6 stroke-1 mb-1" />
              <span className="text-[11px] font-medium">Belum ada gambar logo</span>
            </div>
          )}
        </div>

        {/* Ganti / Upload Logo Button */}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-9 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 gap-1.5"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Ganti Logo</span>
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* Input Nama Instansi */}
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold text-slate-500">
            Nama Instansi / Mitra (Opsional)
          </Label>
          <Input
            placeholder={`Logo ${index + 1}`}
            value={item.name || ''}
            onChange={(e) => onChangeName(item.id, e.target.value)}
            className="h-9 rounded-xl border-slate-200 text-xs bg-white focus-visible:ring-emerald-500"
          />
        </div>

        {/* Input Link Tujuan */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-semibold text-slate-500">
              Link Tujuan (Opsional)
            </Label>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                <span>Buka</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <Input
            placeholder="https://..."
            type="url"
            value={item.link || ''}
            onChange={(e) => onChangeLink(item.id, e.target.value)}
            className="h-9 rounded-xl border-slate-200 text-xs bg-white focus-visible:ring-emerald-500 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

export function FooterLogosSettingsForm() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const footerLogosRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'footerLogos', 'default');
  }, [firestore]);

  const { data: footerLogosData, isLoading: isDataLoading } = useDoc<FooterLogosInfo>(footerLogosRef);

  const [items, setItems] = useState<PartnerLogoItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Sync data from Firestore
  useEffect(() => {
    if (!footerLogosData) return;

    if (Array.isArray(footerLogosData.items) && footerLogosData.items.length > 0) {
      setItems(footerLogosData.items);
      return;
    }

    // Fallback to legacy fields
    const legacyList: PartnerLogoItem[] = [];
    const keys: Array<'logo1' | 'logo2' | 'logo3' | 'logo4'> = ['logo1', 'logo2', 'logo3', 'logo4'];
    keys.forEach((key, idx) => {
      const url = footerLogosData[`${key}Url` as keyof FooterLogosInfo] as string | undefined;
      const link = footerLogosData[`${key}Link` as keyof FooterLogosInfo] as string | undefined;
      if (url) {
        legacyList.push({
          id: `logo-${idx + 1}`,
          name: `Logo ${idx + 1}`,
          url,
          link: link || '',
        });
      }
    });

    if (legacyList.length > 0) {
      setItems(legacyList);
    } else {
      // Default 1 empty slot if completely empty
      setItems([
        { id: `logo-1-${Date.now()}`, name: 'Logo 1', url: '', link: '' },
      ]);
    }
  }, [footerLogosData]);

  const handleAddLogo = () => {
    const nextIndex = items.length + 1;
    const newItem: PartnerLogoItem = {
      id: `logo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `Logo ${nextIndex}`,
      url: '',
      link: '',
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveLogo = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: 'Slot Logo Dihapus',
      description: 'Klik "Simpan Semua Perubahan" untuk menerapkan.',
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const clone = [...prev];
      const temp = clone[index - 1];
      clone[index - 1] = clone[index];
      clone[index] = temp;
      return clone;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const clone = [...prev];
      const temp = clone[index + 1];
      clone[index + 1] = clone[index];
      clone[index] = temp;
      return clone;
    });
  };

  const handleChangeName = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item))
    );
  };

  const handleChangeLink = (id: string, link: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, link } : item))
    );
  };

  const handleUpload = async (file: File, id: string) => {
    setUploadingId(id);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengunggah logo ke server');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, url: imageUrl } : item))
      );

      toast({
        title: 'Logo Berhasil Diunggah',
        description: 'Pratinjau logo telah diperbarui. Jangan lupa klik Simpan Semua Perubahan.',
      });
    } catch (error: any) {
      console.error('Error upload logo:', error);
      toast({
        title: 'Gagal Unggah',
        description: error.message || 'Terjadi kesalahan saat mengunggah gambar logo.',
        variant: 'destructive',
      });
    } finally {
      setUploadingId(null);
    }
  };

  const handleSaveAll = async () => {
    if (!firestore || !footerLogosRef) return;

    setIsSaving(true);

    try {
      // Clean empty slots or save items
      const payload: FooterLogosInfo = {
        items,
        // Legacy backward compatibility for first 4 logos
        logo1Url: items[0]?.url || '',
        logo1Link: items[0]?.link || '',
        logo2Url: items[1]?.url || '',
        logo2Link: items[1]?.link || '',
        logo3Url: items[2]?.url || '',
        logo3Link: items[2]?.link || '',
        logo4Url: items[3]?.url || '',
        logo4Link: items[3]?.link || '',
      };

      await setDoc(footerLogosRef, payload, { merge: true });

      toast({
        title: 'Berhasil Disimpan',
        description: 'Daftar logo mitra dan instansi telah berhasil disimpan dan aktif di halaman utama.',
      });
    } catch (error: any) {
      console.error('Error saving partner logos:', error);
      toast({
        title: 'Gagal Menyimpan',
        description: error.message || 'Terjadi kesalahan saat menyimpan data ke server.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filledCount = items.filter((item) => Boolean(item.url)).length;

  if (isDataLoading) {
    return (
      <Card className="lg:col-span-2 rounded-3xl border-slate-200">
        <CardHeader>
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-3xl border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden bg-white">
      {/* Header matching Gambar 3 */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 pb-4">
        <div>
          <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
            LOGO MITRA / INSTANSI (FOOTER)
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Kelola logo mitra yang tampil di banner bergulir di atas footer.
          </CardDescription>
        </div>

        <Button
          type="button"
          onClick={handleAddLogo}
          className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all w-fit shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Logo</span>
        </Button>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 pt-2 space-y-6">
        {/* Grid of Logo Cards + Add Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <LogoCard
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              isUploading={uploadingId === item.id}
              onUpload={handleUpload}
              onRemove={handleRemoveLogo}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onChangeName={handleChangeName}
              onChangeLink={handleChangeLink}
            />
          ))}

          {/* Dashed Add Card matching Gambar 3 */}
          <button
            type="button"
            onClick={handleAddLogo}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-50/30 group min-h-[290px] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300 bg-white text-emerald-600 shadow-xs transition-transform duration-200 group-hover:scale-110 mb-3">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-800">
              Tambah Logo Baru
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Klik untuk tambah slot logo
            </p>
          </button>
        </div>

        {/* Bottom Actions Row matching Gambar 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500">
            Total {filledCount} logo terisi dari {items.length} slot.
          </p>

          <Button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all w-fit"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan Semua Perubahan...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Simpan Semua Perubahan</span>
              </>
            )}
          </Button>
        </div>

        {/* Info Box matching Gambar 3 */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-5 text-xs text-slate-700 space-y-2">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <span>💡</span>
            <span>Petunjuk Pengelolaan Logo Mitra:</span>
          </p>
          <ul className="space-y-1.5 text-slate-600 pl-1 leading-relaxed">
            <li>
              <strong className="text-slate-800">• Tambah Logo:</strong> Klik tombol{' '}
              <span className="font-semibold text-emerald-700">+ Tambah Logo</span> di sudut kanan atas atau kartu bergaris putus-putus.
            </li>
            <li>
              <strong className="text-slate-800">• Format Gambar:</strong> PNG transparan, JPG, WebP, atau SVG (resolusi terbaik: minimal tinggi 120px).
            </li>
            <li>
              <strong className="text-slate-800">• Link Tujuan:</strong> Jika diisi, pengunjung yang mengklik logo di halaman utama akan diarahkan ke link tersebut di tab baru.
            </li>
            <li>
              <strong className="text-slate-800">• Urutan Tampilan:</strong> Gunakan panah naik (↑) atau turun (↓) di setiap kartu untuk mengatur susunan logo.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
