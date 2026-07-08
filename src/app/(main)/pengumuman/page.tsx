'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Announcement } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function PengumumanPage() {
  const firestore = useFirestore();
  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'announcements'), orderBy('publishDate', 'desc'), limit(50));
  }, [firestore]);

  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);

  const formatDate = (date: any) => {
    if (!date) return '-';
    return date.toDate().toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <PageHeader
        title="Pengumuman Desa"
        description="Informasi dan pengumuman penting dari administrasi Desa Pangawaren."
      />

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <>
            <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
            <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
            <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
          </>
        )}
        
        {!isLoading && announcements && announcements.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <Megaphone className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Belum ada pengumuman baru.</p>
          </div>
        )}

        {announcements?.map((announcement) => (
          <Link key={announcement.id} href={`/pengumuman/${announcement.id}`}>
            <Card className="group cursor-pointer overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white flex flex-col h-full">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                {announcement.imageUrl ? (
                  <img 
                    src={announcement.imageUrl} 
                    alt={announcement.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <Megaphone className="h-12 w-12 text-primary/10" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-secondary text-primary-foreground font-black uppercase text-[9px] tracking-widest px-3 py-1 border-none shadow-lg">
                      Info Terbaru
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-8 pb-4 space-y-3">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <Calendar className="h-3 w-3 text-primary/40" />
                  {formatDate(announcement.publishDate)}
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {announcement.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-between">
                <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3 italic mb-6">
                  "{announcement.content}"
                </p>
                
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-primary font-black uppercase text-[10px] tracking-widest">
                  <span>Baca Selengkapnya</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}