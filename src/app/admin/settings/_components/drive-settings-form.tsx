
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Cloud, FolderKey } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { DriveSettingsInfo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Extracts a Google Drive folder ID from a full URL or returns the raw ID.
 * Supports formats like:
 * - https://drive.google.com/drive/folders/1abc123xyz
 * - https://drive.google.com/drive/folders/1abc123xyz?usp=sharing
 * - https://drive.google.com/drive/u/0/folders/1abc123xyz?hl=ID
 * - 1abc123xyz (raw ID)
 * - 1abc123xyz?hl=ID (raw ID with query params)
 */
function extractFolderId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Match folder ID from various Google Drive URL patterns
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  const id = match ? match[1] : trimmed;
  // Strip query parameters like ?hl=ID or ?usp=sharing
  return id.split('?')[0].split('#')[0];
}

export function DriveSettingsForm() {
  const [googleDriveLink, setGoogleDriveLink] = useState('');
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [rootFolderId, setRootFolderId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const driveRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'driveSettings', 'default');
  }, [firestore]);

  const { data: driveData, isLoading } = useDoc<DriveSettingsInfo>(driveRef);

  useEffect(() => {
    if (driveData) {
      setGoogleDriveLink(driveData.googleDriveLink || '');
      setAppsScriptUrl(driveData.appsScriptUrl || '');
      setRootFolderId(driveData.rootFolderId || '');
    }
  }, [driveData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !driveRef) return;
    setIsSaving(true);

    try {
      const cleanRootFolderId = extractFolderId(rootFolderId);
      await setDoc(driveRef, { 
        googleDriveLink, 
        appsScriptUrl: appsScriptUrl.trim(),
        rootFolderId: cleanRootFolderId
      }, { merge: true });
      // Update local state with the cleaned ID
      setRootFolderId(cleanRootFolderId);
      
      toast({
        title: "Pengaturan Tersimpan",
        description: "Konfigurasi Google Drive telah diperbarui.",
      });
    } catch (error: any) {
      toast({
        title: "Gagal Menyimpan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full rounded-3xl" />;

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Cloud className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Konfigurasi Google Drive (Pelayanan Surat)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Atur lokasi folder penyimpanan berkas lampiran warga dan webhook Apps Script.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="drive-link" className="text-xs font-bold text-slate-700">
                Tautan Folder Google Drive (Arsip Pelayanan)
              </Label>
              <Input
                id="drive-link"
                placeholder="https://drive.google.com/drive/folders/..."
                value={googleDriveLink}
                onChange={(e) => setGoogleDriveLink(e.target.value)}
                disabled={isSaving}
                className="rounded-xl border-slate-200 text-xs h-10 font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Pintasan folder Google Drive untuk tombol pintas di panel admin surat.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="root-id" className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <FolderKey className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>ID Folder Utama (ROOT_FOLDER_ID)</span>
              </Label>
              <Input
                id="root-id"
                placeholder="Contoh: 1h7bN7GMASbXOgOhxjMHXEkxR-yg5p0iq"
                value={rootFolderId}
                onChange={(e) => setRootFolderId(e.target.value)}
                disabled={isSaving}
                className="font-mono text-xs rounded-xl border-slate-200 h-10"
              />
              <p className="text-[11px] text-slate-500">
                ID folder Google Drive tempat sistem membuat subfolder per-pengajuan surat.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="script-url" className="text-xs font-bold text-slate-700">
                Apps Script Web App URL
              </Label>
              <Input
                id="script-url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={appsScriptUrl}
                onChange={(e) => setAppsScriptUrl(e.target.value)}
                disabled={isSaving}
                className="rounded-xl border-slate-200 text-xs h-10 font-mono"
              />
              <p className="text-[11px] text-slate-500">
                URL endpoint Web App dari Google Apps Script untuk otomatisasi upload berkas warga.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <p className="text-xs text-slate-400 hidden sm:block">
              Terintegrasi dengan sistem persuratan
            </p>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-md shadow-emerald-600/15 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              <span>Simpan Konfigurasi Drive</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
