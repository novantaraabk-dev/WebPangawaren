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
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Profil Desa
        </CardTitle>
        <CardDescription>Masukkan tautan YouTube untuk menampilkan video profil desa di halaman depan.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="youtube-video-url">Tautan YouTube</Label>
            <Input
              id="youtube-video-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeVideoUrl}
              onChange={(e) => setYoutubeVideoUrl(e.target.value)}
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
              Tautan akan disimpan dan ditampilkan di bagian video profil desa pada halaman utama.
            </p>
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Video Profil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
