'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { antiKorupsiData, AntiKorupsiItem } from '@/lib/desa-anti-korupsi-data';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  Loader2, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface DriveSettingsInfo {
  appsScriptUrl?: string;
  rootFolderId?: string;
}

interface DBItemData {
  itemId: string;
  pdfUrl?: string;
  pdfName?: string;
  imageUrl?: string;
  imageName?: string;
  updatedAt?: any;
}

// Clean folder ID helper
function extractFolderId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  const id = match ? match[1] : trimmed;
  return id.split('?')[0].split('#')[0];
}

// Extract Google Drive File ID helper
const extractFileIdFromUrl = (url: string): string => {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  return idMatch ? idMatch[1] : url;
};

// File base64 helper
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function AdminDesaAntiKorupsi() {
  const { toast } = useToast();
  const firestore = useFirestore();

  // Selection States
  const [selectedPilarId, setSelectedPilarId] = useState<string>('');
  const [selectedSubMenuId, setSelectedSubMenuId] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  // Selected Item Details
  const [currentItem, setCurrentItem] = useState<AntiKorupsiItem | null>(null);

  // Firestore DB status for selected item
  const [dbData, setDbData] = useState<DBItemData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Upload States
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Drive configurations
  const [driveConfig, setDriveConfig] = useState<DriveSettingsInfo | null>(null);
  const [subFolderMappings, setSubFolderMappings] = useState<Record<string, string>>({});

  // Get matching sub menus for selected pilar
  const currentPilar = useMemo(() => {
    return antiKorupsiData.find(p => p.id === selectedPilarId) || null;
  }, [selectedPilarId]);

  // Get matching items for selected sub menu
  const currentSubMenu = useMemo(() => {
    if (!currentPilar) return null;
    return currentPilar.subMenus.find(s => s.id === selectedSubMenuId) || null;
  }, [currentPilar, selectedSubMenuId]);

  // Reset dropdowns when parent resets
  useEffect(() => {
    setSelectedSubMenuId('');
    setSelectedItemId('');
    setCurrentItem(null);
    setDbData(null);
  }, [selectedPilarId]);

  useEffect(() => {
    setSelectedItemId('');
    setCurrentItem(null);
    setDbData(null);
  }, [selectedSubMenuId]);

  // Load current item data & details when selected item changes
  useEffect(() => {
    if (!selectedItemId || !currentSubMenu) {
      setCurrentItem(null);
      setDbData(null);
      return;
    }
    const item = currentSubMenu.items.find(i => i.id === selectedItemId) || null;
    setCurrentItem(item);
    
    if (item && firestore) {
      fetchItemData(item.id);
    }
  }, [selectedItemId, currentSubMenu, firestore]);

  // Fetch Drive settings from firestore
  useEffect(() => {
    async function loadDriveConfig() {
      if (!firestore) return;
      try {
        const driveRef = doc(firestore, 'driveSettings', 'default');
        const driveSnap = await getDoc(driveRef);
        if (driveSnap.exists()) {
          setDriveConfig(driveSnap.data() as DriveSettingsInfo);
        }

        const subRef = doc(firestore, 'driveSettings', 'desaAntiKorupsi');
        const subSnap = await getDoc(subRef);
        if (subSnap.exists()) {
          setSubFolderMappings(subSnap.data().mappings || {});
        }
      } catch (error) {
        console.error('Gagal mengambil pengaturan Drive:', error);
      }
    }
    loadDriveConfig();
  }, [firestore]);

  // Fetch item data from firestore
  const fetchItemData = async (itemId: string) => {
    if (!firestore) return;
    setIsDataLoading(true);
    try {
      const docRef = doc(firestore, 'desaAntiKorupsi', itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDbData(docSnap.data() as DBItemData);
      } else {
        setDbData(null);
      }
    } catch (error) {
      console.error('Error fetching document data:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Image compression utility
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
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Generic Google Drive file uploader via Apps Script URL
  const uploadToDrive = async (file: File, suffix: string): Promise<{ url: string; name: string }> => {
    if (!currentItem || !firestore) throw new Error('Data item belum lengkap.');

    const appsScriptUrl = (driveConfig?.appsScriptUrl || '').trim();
    // Retrieve custom sub folder ID, fallback to root folder ID
    const targetFolderId = subFolderMappings[selectedSubMenuId] || extractFolderId(driveConfig?.rootFolderId || '');

    if (!appsScriptUrl || !targetFolderId) {
      throw new Error('URL Apps Script atau Folder ID Google Drive belum terkonfigurasi di Pengaturan.');
    }

    const base64Data = await convertFileToBase64(file);
    const payload = {
      rootFolderId: targetFolderId,
      folderName: "DESA ANTI KORUPSI",
      letterType: "Anti Korupsi",
      requesterName: "ADMIN",
      files: [{
        base64Data,
        mimeType: file.type,
        targetFileName: `${currentItem.id}_${currentItem.title.replace(/\s+/g, '_')}_${suffix}`.toUpperCase(),
      }]
    };

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
    });

    const resultText = await response.text();
    let result;
    try {
      result = JSON.parse(resultText);
    } catch {
      throw new Error("Respons dari Apps Script tidak valid.");
    }

    if (result.status !== 'success') {
      throw new Error(result.message || 'Gagal mengunggah berkas ke Google Drive.');
    }

    const fileId = result.files[0].fileId;
    return {
      url: `https://drive.google.com/file/d/${fileId}/view`,
      name: file.name
    };
  };

  // Upload PDF to Google Drive
  const handlePdfUpload = async () => {
    if (!pdfFile || !currentItem || !firestore) return;
    setIsPdfUploading(true);

    try {
      const uploadResult = await uploadToDrive(pdfFile, 'PDF');

      // Save to Firestore
      const docRef = doc(firestore, 'desaAntiKorupsi', currentItem.id);
      await setDoc(docRef, {
        itemId: currentItem.id,
        pdfUrl: uploadResult.url,
        pdfName: uploadResult.name,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({
        title: 'PDF Berhasil Unggah',
        description: `Dokumen ${pdfFile.name} disimpan ke Google Drive.`,
      });

      setPdfFile(null);
      fetchItemData(currentItem.id);
    } catch (error: any) {
      console.error('Gagal upload PDF:', error);
      toast({
        title: 'Gagal Mengunggah PDF',
        description: error.message || 'Terjadi kesalahan sistem.',
        variant: 'destructive',
      });
    } finally {
      setIsPdfUploading(false);
    }
  };

  // Upload Photo to Google Drive (with compression)
  const handleImageUpload = async () => {
    if (!imageFile || !currentItem || !firestore) return;
    setIsImageUploading(true);

    try {
      // Compress client-side
      const compressedFile = await compressImage(imageFile);
      const uploadResult = await uploadToDrive(compressedFile, 'IMG');

      // Save to Firestore
      const docRef = doc(firestore, 'desaAntiKorupsi', currentItem.id);
      await setDoc(docRef, {
        itemId: currentItem.id,
        imageUrl: uploadResult.url,
        imageName: uploadResult.name,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({
        title: 'Foto Berhasil Unggah',
        description: `Gambar ${imageFile.name} berhasil dikompresi dan disimpan ke Google Drive.`,
      });

      setImageFile(null);
      fetchItemData(currentItem.id);
    } catch (error: any) {
      console.error('Gagal upload gambar:', error);
      toast({
        title: 'Gagal Mengunggah Foto',
        description: error.message || 'Terjadi kesalahan saat mengunggah.',
        variant: 'destructive',
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  // Delete PDF
  const handleDeletePdf = async () => {
    if (!currentItem || !firestore) return;
    if (!confirm('Apakah Anda yakin ingin menghapus PDF ini dari sistem?')) return;

    try {
      const docRef = doc(firestore, 'desaAntiKorupsi', currentItem.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.imageUrl) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, {
            itemId: currentItem.id,
            imageUrl: data.imageUrl,
            imageName: data.imageName || ''
          });
        }
      }

      toast({ title: 'Berhasil Dihapus', description: 'Tautan dokumen PDF dihapus.' });
      fetchItemData(currentItem.id);
    } catch (error: any) {
      toast({ title: 'Gagal Menghapus', description: error.message, variant: 'destructive' });
    }
  };

  // Delete Image
  const handleDeleteImage = async () => {
    if (!currentItem || !firestore) return;
    if (!confirm('Apakah Anda yakin ingin menghapus foto dukung ini dari sistem?')) return;

    try {
      const docRef = doc(firestore, 'desaAntiKorupsi', currentItem.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.pdfUrl) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, {
            itemId: currentItem.id,
            pdfUrl: data.pdfUrl,
            pdfName: data.pdfName || ''
          });
        }
      }

      toast({ title: 'Berhasil Dihapus', description: 'Tautan foto dukung dihapus.' });
      fetchItemData(currentItem.id);
    } catch (error: any) {
      toast({ title: 'Gagal Menghapus', description: error.message, variant: 'destructive' });
    }
  };

  // Preview Image direct URL
  const embeddedImageUrl = useMemo(() => {
    if (!dbData?.imageUrl) return '';
    const fileId = extractFileIdFromUrl(dbData.imageUrl);
    return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : dbData.imageUrl;
  }, [dbData?.imageUrl]);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-850 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <span>Kelola Desa Anti Korupsi</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Sistem Unggah Dokumen Pilar Anti Korupsi Desa Pangawaren ke Google Drive
          </p>
        </div>
      </div>

      {/* Selectors Panel */}
      <Card className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <CardTitle className="text-slate-800 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
            <span>PILIH RINCIAN SUB MENU</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Gunakan filter bertingkat untuk memilih item dokumen yang akan diatur.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilar Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori Pilar Utama</Label>
              <Select value={selectedPilarId} onValueChange={setSelectedPilarId}>
                <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50/50 hover:bg-slate-50 font-semibold text-xs text-slate-700">
                  <SelectValue placeholder="Pilih Pilar Utama..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white">
                  {antiKorupsiData.map((pilar) => (
                    <SelectItem key={pilar.id} value={pilar.id} className="text-xs font-semibold py-2">
                      Pilar {pilar.id} - {pilar.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Menu Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sub Menu</Label>
              <Select 
                value={selectedSubMenuId} 
                onValueChange={setSelectedSubMenuId}
                disabled={!selectedPilarId}
              >
                <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50/50 hover:bg-slate-50 font-semibold text-xs text-slate-700">
                  <SelectValue placeholder={selectedPilarId ? "Pilih Sub Menu..." : "Pilih Kategori Utama Dahulu"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white">
                  {currentPilar?.subMenus.map((subMenu) => (
                    <SelectItem key={subMenu.id} value={subMenu.id} className="text-xs font-semibold py-2">
                      {subMenu.id} - {subMenu.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Item Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rincian Dokumen</Label>
              <Select 
                value={selectedItemId} 
                onValueChange={setSelectedItemId}
                disabled={!selectedSubMenuId}
              >
                <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50/50 hover:bg-slate-50 font-semibold text-xs text-slate-700">
                  <SelectValue placeholder={selectedSubMenuId ? "Pilih Rincian Dokumen..." : "Pilih Sub Menu Dahulu"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white">
                  {currentSubMenu?.items.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="text-xs font-semibold py-2">
                      {item.id} - {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Upload Actions Panel */}
      {currentItem && (
        <Card className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm bg-white animate-fadeIn">
          <CardHeader className="bg-emerald-50/40 border-b border-emerald-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <Badge className="bg-emerald-600 hover:bg-emerald-600 rounded-full font-mono text-[10px] font-bold px-2 py-0.5">
                  ID: {currentItem.id}
                </Badge>
                <CardTitle className="text-slate-800 text-sm md:text-base font-extrabold tracking-tight mt-1">
                  {currentItem.title}
                </CardTitle>
                {currentSubMenu && (
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">
                    Bagian dari: {currentSubMenu.title}
                  </p>
                )}
              </div>
              
              {/* Target Folder ID Info Badge */}
              <div className="shrink-0">
                {subFolderMappings[selectedSubMenuId] ? (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-full text-[9px] uppercase font-bold py-1 px-3">
                    Folder Drive Terpetakan: {subFolderMappings[selectedSubMenuId].substring(0, 8)}...
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] text-slate-400 border-slate-200 uppercase font-bold py-1 px-3">
                    Folder Drive: Default Root
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isDataLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
                <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Memuat status berkas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. PDF Section (Google Drive) */}
                <div className="border border-slate-150 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-red-500" />
                      <span>Berkas PDF (Google Drive)</span>
                    </h3>
                    {dbData?.pdfUrl ? (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-full text-[9px] uppercase font-bold px-2">
                        Terunggah
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[9px] uppercase font-bold px-2">
                        Belum Ada
                      </Badge>
                    )}
                  </div>

                  {dbData?.pdfUrl ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-red-100 text-red-600 flex items-center justify-center rounded-lg shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-750 truncate">
                            {dbData.pdfName || 'Dokumen PDF Desa Anti Korupsi'}
                          </p>
                          <a 
                            href={dbData.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-600 font-bold hover:underline inline-flex items-center mt-1"
                          >
                            <span>Buka di Google Drive</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <Button 
                          onClick={handleDeletePdf} 
                          variant="destructive" 
                          size="sm"
                          className="h-8 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Hapus Tautan
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-dashed border-slate-200 hover:border-emerald-300 rounded-xl p-6 transition-colors flex flex-col items-center justify-center bg-slate-50/50">
                        <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider">
                          Pilih File PDF untuk Diunggah
                        </p>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="pdf-file-selector"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('pdf-file-selector')?.click()}
                          className="h-8 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider mt-3"
                        >
                          Pilih File
                        </Button>
                        {pdfFile && (
                          <p className="text-[10px] text-emerald-700 font-bold mt-3 text-center truncate max-w-full">
                            Terpilih: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={handlePdfUpload}
                        disabled={!pdfFile || isPdfUploading}
                        className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider"
                      >
                        {isPdfUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Mengunggah ke Drive...
                          </>
                        ) : (
                          <>
                            <UploadCloud className="h-4 w-4 mr-2" />
                            Unggah ke Google Drive
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* 2. Photo Section (Google Drive - Instead of Cloudinary) */}
                <div className="border border-slate-150 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                      <span>Dokumentasi Gambar (Google Drive)</span>
                    </h3>
                    {dbData?.imageUrl ? (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-full text-[9px] uppercase font-bold px-2">
                        Terunggah
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[9px] uppercase font-bold px-2">
                        Belum Ada
                      </Badge>
                    )}
                  </div>

                  {dbData?.imageUrl ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                      {embeddedImageUrl && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                          <img 
                            src={embeddedImageUrl} 
                            alt="Dokumentasi" 
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0 py-1">
                        <p className="text-[10px] font-bold text-slate-500 truncate">
                          Nama File: {dbData.imageName || 'Gambar Dukung'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                        <a 
                          href={dbData.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-600 font-bold hover:underline inline-flex items-center"
                        >
                          <span>Buka di Google Drive</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                        <Button 
                          onClick={handleDeleteImage} 
                          variant="destructive" 
                          size="sm"
                          className="h-8 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Hapus Gambar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-dashed border-slate-200 hover:border-emerald-300 rounded-xl p-6 transition-colors flex flex-col items-center justify-center bg-slate-50/50">
                        <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider">
                          Pilih Gambar (JPG, JPEG, PNG)
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="image-file-selector"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('image-file-selector')?.click()}
                          className="h-8 rounded-full border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider mt-3"
                        >
                          Pilih Gambar
                        </Button>
                        <p className="text-[9px] text-slate-400 mt-2 text-center">
                          Gambar otomatis dikompresi sebelum diunggah ke Google Drive
                        </p>
                        {imageFile && (
                          <p className="text-[10px] text-emerald-700 font-bold mt-2 text-center truncate max-w-full">
                            Terpilih: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={handleImageUpload}
                        disabled={!imageFile || isImageUploading}
                        className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider"
                      >
                        {isImageUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Mengompresi & Mengunggah...
                          </>
                        ) : (
                          <>
                            <UploadCloud className="h-4 w-4 mr-2" />
                            Unggah ke Google Drive
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Guide/Info Card */}
      {!currentItem && (
        <Card className="border border-dashed border-slate-300 rounded-3xl bg-slate-50/50 p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-slate-800 font-extrabold text-sm uppercase tracking-wider">Pilih Rincian Dokumen Terlebih Dahulu</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Silakan pilih Kategori Pilar, Sub Menu, dan Rincian Dokumen pada panel di atas untuk mengunggah dokumen PDF dan Dokumentasi Foto ke Google Drive.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
