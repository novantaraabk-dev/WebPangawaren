'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Video } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { VillageProfileInfo } from '@/lib/types';

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export function VideoProfileSettingsForm() {
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profileData, isLoading: isDataLoading } = useDoc<VillageProfileInfo>(profileRef);

  useEffect(() => {
    if (profileData?.youtubeVideoUrl) {
      setYoutubeVideoUrl(profileData.youtubeVideoUrl);
    }
  }, [profileData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !profileRef) return;
    setIsSaving(true);

    try {
      await setDoc(profileRef, { youtubeVideoUrl }, { merge: true });
      toast({ title: 'Tautan Video Disimpan', description: 'Link video profil desa telah diperbarui.' });
    } catch (error) {
      console.error('Error saving village profile video URL:', error);
      toast({ title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan tautan video.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return <Skeleton className="h-[300px] w-full rounded-3xl" />;
  }

  const youtubeId = extractYouTubeId(youtubeVideoUrl);

  return (
    <Card className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden h-full">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Video Profil Desa
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Tautan video YouTube yang ditampilkan di bagian video profil desa pada beranda.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pratinjau Video YouTube
              </Label>
              {youtubeId ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Video Terdeteksi
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Belum ada URL
                </span>
              )}
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-900/90 flex items-center justify-center shadow-inner">
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                  title="YouTube video player"
                  className="w-full h-full rounded-2xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                  <Video className="h-8 w-8 stroke-1 text-slate-500" />
                  <p className="text-xs font-medium text-slate-300">Masukkan link YouTube di bawah untuk melihat pratinjau video.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube-video-url" className="text-xs font-bold text-slate-700">
              Tautan Video YouTube
            </Label>
            <Input
              id="youtube-video-url"
              type="url"
              placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
              value={youtubeVideoUrl}
              onChange={(e) => setYoutubeVideoUrl(e.target.value)}
              disabled={isSaving}
              className="rounded-xl border-slate-200 text-xs h-10 font-mono"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Pastikan visibilitas video di YouTube diatur ke <span className="font-bold text-slate-700">Publik</span> atau <span className="font-bold text-slate-700">Tidak Publik</span> (Unlisted).
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
            <p className="text-xs text-slate-400 hidden sm:block">
              Embed responsif otomatis di beranda
            </p>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider gap-2 shadow-md shadow-emerald-600/15 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Simpan Video Profil</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
