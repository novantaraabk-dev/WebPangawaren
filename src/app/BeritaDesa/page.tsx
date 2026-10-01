'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, ChevronRight, ChevronLeft, Search, TrendingUp, PlayCircle, RotateCcw } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { News } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NewsImageGrid } from '@/components/news-image-grid';
import { CardContourPattern } from '@/components/landing/CardContourPattern';
import { NewsCalendarWidget, parseNewsDate } from '@/components/news-calendar-widget';

export default function PublicBeritaListPage() {
  const firestore = useFirestore();
  const topSliderRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const newsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'news'), orderBy('updatedAt', 'desc'));
  }, [firestore]);

  const { data: allNews, isLoading } = useCollection<News>(newsQuery);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (topSliderRef.current) {
      const scrollAmount = 300;
      topSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const { headline, trending, topStories, feed } = useMemo(() => {
    if (!allNews || allNews.length === 0) {
      return { headline: null, trending: [], topStories: [], feed: [] };
    }

    const sorted = [...allNews];
    const headlines = sorted.filter(n => n.isHeadline);
    const mainHeadline = headlines.length > 0 ? headlines[0] : sorted[0];

    const others = sorted.filter(n => n.id !== mainHeadline.id);
    const topStoriesList = others.length > 0 ? others : sorted;
    const topPicks = others.slice(0, 5);
    const remainingFeed = others.slice(5);

    return {
      headline: mainHeadline,
      trending: topPicks,
      topStories: topStoriesList,
      feed: remainingFeed,
    };
  }, [allNews]);

  // Feed items filtered by selected calendar date or search query
  const displayedFeed = useMemo(() => {
    let list = feed;

    if (selectedDate) {
      list = (allNews || []).filter((item) => {
        const parsed = parseNewsDate(item);
        if (!parsed) return false;
        return (
          parsed.getFullYear() === selectedDate.getFullYear() &&
          parsed.getMonth() === selectedDate.getMonth() &&
          parsed.getDate() === selectedDate.getDate()
        );
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = (selectedDate ? list : (allNews || [])).filter((item) =>
        item.title?.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedDate, searchQuery, feed, allNews]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm font-sans">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita desa..."
                className="pl-10 h-10 bg-slate-100 border-none rounded-full"
              />
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" className="font-bold gap-2 text-primary hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">

        {/* TOP PICKS / HORIZONTAL CAROUSEL WITH LEFT & RIGHT ARROWS */}
        <section aria-label="Sorotan Berita" className="relative group/carousel">
          {/* Left Arrow Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scrollSlider('left')}
            className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/95 text-slate-800 shadow-xl border border-slate-200/90 hover:bg-primary hover:text-white transition-all hover:scale-110 flex items-center justify-center opacity-90 group-hover/carousel:opacity-100"
            aria-label="Geser berita ke kiri"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Slider Track */}
          <div
            ref={topSliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar py-2 px-1 scrollbar-none"
          >
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0">
                  <Skeleton className="h-32 rounded-xl" />
                </div>
              ))
            ) : topStories.map((item) => (
              <Link
                key={item.id}
                href={`/BeritaDesa/${item.id}`}
                className="w-[200px] sm:w-[220px] md:w-[240px] shrink-0 group flex flex-col gap-2"
              >
                <div className="aspect-video rounded-xl overflow-hidden shadow-xs bg-slate-100 relative flex items-center justify-center border border-slate-200/80">
                  {item.imageUrl || (item.imageUrls && item.imageUrls.length > 0) ? (
                    <img
                      src={item.imageUrls?.[0] || item.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={item.title}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                      <div className="flex flex-col items-center gap-2">
                        <PlayCircle className="h-8 w-8 text-emerald-400" />
                        <p className="text-[10px] uppercase tracking-[0.2em]">Video</p>
                      </div>
                    </div>
                  )}
                </div>
                <h4 className="text-[10px] sm:text-[11px] font-black leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-colors font-sans">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>

          {/* Right Arrow Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scrollSlider('right')}
            className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/95 text-slate-800 shadow-xl border border-slate-200/90 hover:bg-primary hover:text-white transition-all hover:scale-110 flex items-center justify-center opacity-90 group-hover/carousel:opacity-100"
            aria-label="Geser berita ke kanan"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </section>

        {/* MAIN ROW: HEADLINE & INFO PENTING */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {isLoading ? (
               <Skeleton className="h-[500px] rounded-3xl" />
            ) : headline && (
               <Link href={`/BeritaDesa/${headline.id}`} className="group relative block rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px] border-4 border-white">
                  <img
                    src={headline.imageUrls?.[0] || headline.imageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={headline.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-6 w-full">
                    <Badge className="bg-secondary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none">
                      Berita Utama
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-semibold text-white leading-[1.1] tracking-tighter uppercase font-display">
                      {headline.title}
                    </h2>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-white/70 uppercase tracking-widest font-sans">
                       <span className="flex items-center gap-2"><Calendar className="h-3 w-3 text-secondary" /> {headline.date}</span>
                       <span className="flex items-center gap-2"><User className="h-3 w-3 text-secondary" /> {headline.author}</span>
                    </div>
                  </div>
               </Link>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="relative overflow-hidden isolate rounded-[2rem] border-none bg-primary text-white shadow-xl">
               <CardContourPattern opacity={0.12} className="text-secondary" />
               <CardContent className="p-8 space-y-6 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-lg font-semibold uppercase font-display italic">Info <span className="text-secondary">Penting</span></h3>
                    <TrendingUp className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="space-y-4">
                    {trending.slice(0, 4).map((item, i) => (
                       <Link key={item.id} href={`/BeritaDesa/${item.id}`} className="flex gap-4 group">
                          <span className="text-2xl font-black text-white/20 italic group-hover:text-secondary">0{i+1}</span>
                          <div className="space-y-1">
                             <h4 className="text-[11px] font-bold uppercase leading-tight line-clamp-2 font-sans group-hover:text-secondary">
                                {item.title}
                             </h4>
                             <p className="text-[9px] font-bold text-white/40 uppercase font-sans">{item.date}</p>
                          </div>
                       </Link>
                    ))}
                  </div>
               </CardContent>
            </Card>

            <div className="space-y-4 font-sans">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-2 border-l-4 border-secondary">Topik Populer</h3>
               <div className="flex flex-wrap gap-2">
                  {['Pertanian', 'Pembangunan', 'Cilacap', 'Desa Digital', 'Gotong Royong'].map(tag => (
                    <Badge key={tag} variant="outline" className="rounded-xl bg-white text-[9px] font-black py-1.5 px-4 text-slate-600 border-slate-200 uppercase">
                      # {tag}
                    </Badge>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* FEED / BERITA TERBARU WITH DATE CALENDAR WIDGET ON THE RIGHT */}
        <div className="space-y-8 pt-10 border-t border-slate-200">
           <div className="flex flex-wrap items-center justify-between gap-4">
             <div>
               <h2 className="text-2xl font-semibold text-slate-900 uppercase tracking-tighter font-display">
                 {selectedDate ? (
                   <span>
                     Berita Tanggal: <span className="text-primary italic">{selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   </span>
                 ) : (
                   <span>
                     Berita <span className="text-primary italic">Terbaru</span>
                   </span>
                 )}
               </h2>
               <p className="text-xs text-slate-500 font-medium mt-1">
                 {selectedDate
                   ? `Menampilkan ${displayedFeed.length} berita untuk tanggal terpilih.`
                   : 'Kumpulan dokumentasi kegiatan, informasi resmi, dan artikel pembangunan Desa Pangawaren.'}
               </p>
             </div>

             {selectedDate && (
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setSelectedDate(null)}
                 className="rounded-full text-xs font-bold gap-2 text-primary border-primary hover:bg-primary hover:text-white"
               >
                 <RotateCcw className="h-3.5 w-3.5" />
                 Tampilkan Semua Berita
               </Button>
             )}
           </div>

           <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: Feed list */}
              <div className="lg:col-span-8 space-y-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
                ) : displayedFeed.length === 0 ? (
                    <div className="p-12 text-center rounded-[2.5rem] bg-slate-50 border border-dashed border-slate-300 space-y-3">
                      <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                      <h4 className="text-base font-bold text-slate-700">Tidak ada berita yang ditemukan</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        {selectedDate
                          ? `Belum ada berita yang diterbitkan pada tanggal ${selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`
                          : 'Belum ada berita yang sesuai dengan kata kunci pencarian Anda.'}
                      </p>
                      {selectedDate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDate(null)}
                          className="mt-2 rounded-xl text-xs font-bold border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          Tampilkan Semua Berita
                        </Button>
                      )}
                    </div>
                ) : (
                  displayedFeed.map((item) => {
                    const hasPhotos = (item.imageUrls && item.imageUrls.length > 0) || Boolean(item.imageUrl);
                    return (
                      <div key={item.id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-200/80 hover:shadow-xl transition-all duration-300 font-sans relative overflow-hidden isolate">
                        <CardContourPattern opacity={0.06} className="text-slate-400" />
                        <div className="relative z-10 space-y-4">
                        {/* PHOTO GRID LAYOUT (1, 2, 3, or 4+ PHOTOS) */}
                        {hasPhotos ? (
                          <NewsImageGrid
                            imageUrls={item.imageUrls}
                            imageUrl={item.imageUrl}
                            title={item.title}
                            interactive={true}
                          />
                        ) : (
                          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 text-white flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-center px-4">
                              <PlayCircle className="h-12 w-12 text-emerald-400" />
                              <span className="text-[10px] uppercase tracking-[0.25em]">Video Berita</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3 pt-2">
                           <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <span className="text-primary font-black">{item.date}</span>
                              <span>Penulis: {item.author}</span>
                           </div>
                           <Link href={`/BeritaDesa/${item.id}`}>
                             <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight uppercase group-hover:text-primary transition-colors line-clamp-2 font-display">
                              {item.title}
                             </h3>
                           </Link>
                           <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium">
                              {item.subtitle}
                           </p>
                           <div className="pt-2 flex items-center justify-between">
                             <Link href={`/BeritaDesa/${item.id}`}>
                               <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs gap-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                                 Baca Selengkapnya <ChevronRight className="h-4 w-4" />
                               </Button>
                             </Link>
                             {(item.imageUrls?.length || (item.imageUrl ? 1 : 0)) > 1 && (
                               <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                                 📷 {item.imageUrls?.length} Foto
                               </Badge>
                             )}
                           </div>
                        </div>
                      </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* RIGHT: Realtime Digital Clock + Monthly Calendar + Mini News Cards */}
              <div className="lg:col-span-4 sticky top-24 self-start">
                <NewsCalendarWidget
                  newsList={allNews || []}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              </div>
           </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-primary text-white/50 py-16 mt-auto border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <Logo />
          <p className="mt-8 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Pemerintah Desa Pangawaren • Website Resmi Pemerintahan Desa
          </p>
        </div>
      </footer>
    </div>
  );
}
