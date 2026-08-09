'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { BackgroundPattern } from '@/components/landing/BackgroundPattern';
import { CardContourPattern } from '@/components/landing/CardContourPattern';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Landmark, 
  MapPin, 
  Store, 
  Compass, 
  Leaf,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  Eye,
  ArrowRight
} from 'lucide-react';
import { PotensiDesa } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const POTENSI_CATEGORIES = [
  { id: 'pariwisata-kebudayaan', label: 'Pariwisata & Kebudayaan', icon: Compass, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { id: 'umkm-industri', label: 'UMKM & Industri Kreatif', icon: Store, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { id: 'bumdes', label: 'BUMDes Pangawaren', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { id: 'pertanian-perkebunan', label: 'Pertanian & Perkebunan', icon: Leaf, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { id: 'sda-lingkungan', label: 'Sumber Daya Alam & Lingkungan', icon: MapPin, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' }
] as const;

type CategoryId = typeof POTENSI_CATEGORIES[number]['id'];

function PotensiDesaContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as CategoryId | null;
  
  const [activeTab, setActiveTab] = useState<CategoryId>('pariwisata-kebudayaan');
  const [selectedPotensi, setSelectedPotensi] = useState<PotensiDesa | null>(null);
  const firestore = useFirestore();

  // Sync state with query parameter
  useEffect(() => {
    if (tabParam && POTENSI_CATEGORIES.some(cat => cat.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Load all potentials
  const potentialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'potensiDesa'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: allPotentials, isLoading } = useCollection<PotensiDesa>(potentialsQuery);

  // Filter items in memory by category
  const filteredPotentials = useMemo(() => {
    if (!allPotentials) return [];
    return allPotentials.filter(item => item.category === activeTab);
  }, [allPotentials, activeTab]);

  const activeCategoryDetails = useMemo(() => {
    return POTENSI_CATEGORIES.find(cat => cat.id === activeTab)!;
  }, [activeTab]);

  const selectedCategoryDetails = useMemo(() => {
    if (!selectedPotensi) return activeCategoryDetails;
    return POTENSI_CATEGORIES.find(cat => cat.id === selectedPotensi.category) || activeCategoryDetails;
  }, [selectedPotensi, activeCategoryDetails]);

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900 overflow-x-hidden pt-24 font-sans">
      <BackgroundPattern />
      <Header />
      
      <main className="relative flex-1 container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        {/* Banner Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 md:mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
          <Badge className="bg-emerald-50 text-emerald-700 font-black uppercase text-[10px] tracking-widest px-4 py-1.5 border-none shadow-sm mb-2">
            Potensi & Keunggulan Desa
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight uppercase font-display italic tracking-tighter">
            Kekayaan <span className="text-primary not-italic">Desa</span> Pangawaren
          </h1>
          <p className="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Menelusuri keanekaragaman pariwisata, produk kreatif lokal, pertanian subur, serta tata kelola lingkungan hidup di Desa Pangawaren.
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="bg-white rounded-[2.5rem] p-3 border shadow-sm flex flex-wrap lg:flex-nowrap justify-center gap-2 mb-16 max-w-5xl mx-auto">
          {POTENSI_CATEGORIES.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Update URL parameter without full refresh
                  const url = new URL(window.location.href);
                  url.searchParams.set('tab', tab.id);
                  window.history.pushState({}, '', url.toString());
                }}
                className={cn(
                  "flex items-center justify-center gap-3 px-6 py-4 rounded-[2rem] transition-all duration-300 whitespace-nowrap group flex-1 md:flex-initial",
                  isActive
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <TabIcon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-secondary" : "text-slate-400")} />
                <span className="font-black uppercase text-[10px] tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {isLoading ? (
            // Skeleton Loader Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                  <Skeleton className="w-full aspect-[4/3] rounded-[1.8rem]" />
                  <div className="space-y-3 pt-2">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="h-7 w-3/4 rounded-xl" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPotentials.length === 0 ? (
            // Empty State
            <Card className="border border-dashed border-slate-300 rounded-[3rem] bg-white p-16 text-center max-w-xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={cn("h-16 w-16 rounded-[2rem] flex items-center justify-center border", activeCategoryDetails.bg, activeCategoryDetails.color, activeCategoryDetails.border)}>
                  <activeCategoryDetails.icon className="h-8 w-8" />
                </div>
                <h3 className="text-slate-800 font-black text-lg uppercase tracking-wider italic font-display">Belum Ada Informasi</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Informasi untuk kategori <strong>{activeCategoryDetails.label}</strong> sedang dalam proses penyusunan oleh Pemerintah Desa. Silakan periksa kembali beberapa waktu mendatang.
                </p>
              </div>
            </Card>
          ) : (
            // Cards Grid Layout
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPotentials.map((item) => {
                const hasImages = item.imageUrls && item.imageUrls.length > 0;
                const coverImage = hasImages ? item.imageUrls[0] : null;

                return (
                  <Card
                    key={item.id}
                    onClick={() => setSelectedPotensi(item)}
                    className="group cursor-pointer rounded-[2.5rem] border border-slate-100 bg-white p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden relative"
                  >
                    <CardContourPattern opacity={0.03} className="text-slate-400" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      {/* Cover Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.8rem] bg-slate-100 border border-slate-100/80 mb-5">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100">
                            <ImageIcon className="h-10 w-10 text-slate-350" />
                          </div>
                        )}

                        {/* Image count badge */}
                        {item.imageUrls && item.imageUrls.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                            <ImageIcon className="h-3.5 w-3.5 text-secondary" />
                            <span>{item.imageUrls.length} Foto</span>
                          </div>
                        )}

                        {/* Hover Overlay Hint */}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white/90 backdrop-blur-md text-slate-900 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <Eye className="h-4 w-4 text-primary" />
                            Lihat Detail
                          </span>
                        </div>
                      </div>

                      {/* Card Meta & Header */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-1 rounded-md shrink-0", activeCategoryDetails.bg, activeCategoryDetails.color)}>
                            <activeCategoryDetails.icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            {activeCategoryDetails.label}
                          </span>
                        </div>

                        <h3 className="text-xl font-black text-slate-900 uppercase font-display italic tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {item.subtitle && (
                          <p className="text-xs font-bold text-primary uppercase tracking-wider line-clamp-1 border-l-2 border-secondary pl-2 py-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Snippet Narrative */}
                      <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3 mb-4">
                        {item.narrative}
                      </p>
                    </div>

                    {/* Card Footer Action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 group-hover:text-primary transition-colors flex items-center gap-1">
                        Buka Narasi Lengkap
                      </span>
                      <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-primary group-hover:text-white text-slate-400 flex items-center justify-center transition-all duration-300 shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal Dialog when Card is Clicked */}
      <Dialog open={!!selectedPotensi} onOpenChange={(open) => !open && setSelectedPotensi(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-6 md:p-10 bg-white border-none shadow-2xl">
          {selectedPotensi && (
            <div className="space-y-6">
              {/* Header Info (Judul & Sub Judul) */}
              <DialogHeader className="space-y-3 text-left pr-6">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-lg shrink-0", selectedCategoryDetails.bg, selectedCategoryDetails.color)}>
                    <selectedCategoryDetails.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {selectedCategoryDetails.label}
                  </span>
                </div>

                <DialogTitle className="text-2xl md:text-4xl font-black text-slate-900 uppercase font-display italic tracking-tight leading-tight">
                  {selectedPotensi.title}
                </DialogTitle>

                {selectedPotensi.subtitle && (
                  <DialogDescription className="text-sm md:text-base font-bold text-primary uppercase tracking-wider border-l-4 border-secondary pl-3 py-0.5 text-left">
                    {selectedPotensi.subtitle}
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Main Image Full View (Gambar utama muncul penuh) */}
              {selectedPotensi.imageUrls && selectedPotensi.imageUrls.length > 0 ? (
                <div className="w-full">
                  {selectedPotensi.imageUrls.length > 1 ? (
                    <Carousel className="w-full relative group">
                      <CarouselContent>
                        {selectedPotensi.imageUrls.map((url, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <div className="aspect-[16/9] md:aspect-[21/9] relative w-full overflow-hidden rounded-[2rem] bg-slate-950 border shadow-inner">
                              <img
                                src={url}
                                alt={`${selectedPotensi.title} - Foto ${imgIndex + 1}`}
                                className="w-full h-full object-contain bg-slate-950"
                              />
                              <div className="absolute bottom-4 right-4 bg-slate-900/80 text-white px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                                {imgIndex + 1} / {selectedPotensi.imageUrls.length}
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                        <CarouselPrevious className="relative left-0 translate-y-0 h-10 w-10 pointer-events-auto bg-white/90 hover:bg-white text-slate-800 shadow-lg border-slate-200" />
                        <CarouselNext className="relative right-0 translate-y-0 h-10 w-10 pointer-events-auto bg-white/90 hover:bg-white text-slate-800 shadow-lg border-slate-200" />
                      </div>
                    </Carousel>
                  ) : (
                    <div className="aspect-[16/9] md:aspect-[21/9] relative w-full overflow-hidden rounded-[2rem] bg-slate-950 border shadow-md">
                      <img
                        src={selectedPotensi.imageUrls[0]}
                        alt={selectedPotensi.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video relative w-full overflow-hidden rounded-[2rem] bg-slate-100 border flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-slate-350" />
                </div>
              )}

              {/* Narrative Section (Letakkan Narasi di Bawahnya) */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Deskripsi & Narasi Potensi</h4>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 font-medium leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {selectedPotensi.narrative}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default function PotensiDesaPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">Menyiapkan Konten Potensi...</p>
        </div>
      </div>
    }>
      <PotensiDesaContent />
    </Suspense>
  );
}

