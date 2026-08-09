'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Trash2, Pencil, Loader2, Image as ImageIcon, Save, X } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Announcement } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

const CLOUD_NAME = 'dgsxujjb1';
const UPLOAD_PRESET = 'webdesa';

export function AnnouncementList() {
  const firestore = useFirestore();
  const { toast } = useToast();

  // Edit dialog state
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'announcements'), orderBy('publishDate', 'desc'));
  }, [firestore]);

  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'announcements', id);
    try {
      await deleteDoc(docRef);
      toast({
        title: "Pengumuman Dihapus",
        description: "Pengumuman telah berhasil dihapus.",
      });
    } catch (error) {
      console.error("Error deleting announcement: ", error);
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus pengumuman.",
        variant: "destructive",
      });
    }
  };

  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setEditTitle(announcement.title);
    setEditContent(announcement.content);
    setEditImageUrl(announcement.imageUrl || '');
  };

  const handleCloseEdit = () => {
    setEditingAnnouncement(null);
    setEditTitle('');
    setEditContent('');
    setEditImageUrl('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast({
        title: "File Terlalu Besar",
        description: "Maksimal ukuran gambar adalah 1MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Gagal mengunggah ke Cloudinary');
      setEditImageUrl(data.secure_url);
      toast({ title: 'Gambar Terunggah', description: 'Gambar baru berhasil diunggah.' });
    } catch (error: any) {
      toast({ title: 'Gagal Mengunggah', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!firestore || !editingAnnouncement) return;
    if (!editTitle.trim() || !editContent.trim()) {
      toast({
        title: "Formulir tidak lengkap",
        description: "Judul dan isi pengumuman tidak boleh kosong.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(firestore, 'announcements', editingAnnouncement.id);
      await updateDoc(docRef, {
        title: editTitle.trim(),
        content: editContent.trim(),
        imageUrl: editImageUrl,
        updatedAt: serverTimestamp(),
      });
      toast({
        title: "Pengumuman Diperbarui",
        description: "Perubahan telah berhasil disimpan.",
      });
      handleCloseEdit();
    } catch (error: any) {
      console.error("Error updating announcement:", error);
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan perubahan.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 mt-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Daftar Pengumuman Terbit</CardTitle>
          <CardDescription>Berikut adalah daftar pengumuman yang sudah dipublikasikan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Tanggal Terbit</TableHead>
                  <TableHead>Gambar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements && announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium max-w-[280px]">
                        <p className="truncate">{announcement.title}</p>
                      </TableCell>
                      <TableCell>
                        {announcement.publishDate?.toDate().toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        {announcement.imageUrl ? (
                          <Badge variant="secondary" className="text-emerald-700 bg-emerald-50 border border-emerald-200">Ada Gambar</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Tidak Ada</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() => handleOpenEdit(announcement)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* Delete Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Aksi ini tidak dapat dibatalkan. Pengumuman <strong>&ldquo;{announcement.title}&rdquo;</strong> akan dihapus secara permanen dari server.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDelete(announcement.id)}
                                >
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Belum ada pengumuman yang diterbitkan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingAnnouncement} onOpenChange={(open) => { if (!open) handleCloseEdit(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-blue-600" />
              Edit Pengumuman
            </DialogTitle>
            <DialogDescription>
              Ubah detail pengumuman. Klik &ldquo;Simpan Perubahan&rdquo; untuk memperbarui.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                Gambar Lampiran (Opsional)
              </Label>
              <div className="flex flex-col gap-3">
                {editImageUrl && (
                  <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border-2 border-primary/10 bg-muted">
                    <img src={editImageUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditImageUrl('')}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading || isSaving}
                    className="max-w-xs"
                  />
                  {isUploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Format JPG/PNG. Maks 1MB.</p>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Pengumuman</Label>
              <Input
                id="edit-title"
                placeholder="Contoh: Kerja Bakti Lingkungan"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={isSaving}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="edit-content">Isi Pengumuman</Label>
              <Textarea
                id="edit-content"
                placeholder="Tulis isi lengkap pengumuman di sini..."
                rows={10}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={isSaving}
                className="resize-y min-h-[200px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseEdit} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving || isUploading}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
