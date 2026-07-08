'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, FileText, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ApbdesData, RealisasiApbdesData, ProdukHukumDesa } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function TataKelolaDesa() {
  const [activeTab, setActiveTab] = useState('apbdes');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const firestore = useFirestore();

  // Queries untuk data
  const apbdesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'apbdes'), orderBy('tahun', 'desc'));
  }, [firestore]);

  const realisasiQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'realisasiApbdes'), orderBy('tahun', 'desc'));
  }, [firestore]);

  const produkHukumQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'produkHukumDesa'), orderBy('tahun', 'desc'));
  }, [firestore]);

  const { data: allApbdes, isLoading: isLoadingApbdes } = useCollection<ApbdesData>(apbdesQuery);
  const { data: allRealisasi, isLoading: isLoadingRealisasi } = useCollection<RealisasiApbdesData>(realisasiQuery);
  const { data: allProdukHukum, isLoading: isLoadingProduk } = useCollection<ProdukHukumDesa>(produkHukumQuery);

  // Get data untuk tahun yang dipilih
  const currentApbdes = useMemo(() => {
    return allApbdes?.find(d => d.tahun === selectedYear);
  }, [allApbdes, selectedYear]);

  const currentRealisasi = useMemo(() => {
    return allRealisasi?.find(d => d.tahun === selectedYear);
  }, [allRealisasi, selectedYear]);

  const currentProdukHukum = useMemo(() => {
    return allProdukHukum?.filter(p => p.tahun === selectedYear) || [];
  }, [allProdukHukum, selectedYear]);

  // Get available years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allApbdes?.forEach(d => years.add(d.tahun));
    allRealisasi?.forEach(d => years.add(d.tahun));
    allProdukHukum?.forEach(d => years.add(d.tahun));
    return Array.from(years).sort((a, b) => b - a);
  }, [allApbdes, allRealisasi, allProdukHukum]);

  // Process chart data untuk APBDes
  const apbdesChartData = useMemo(() => {
    if (!currentApbdes?.items) return [];
    const bidangData: Record<string, any> = {};
    currentApbdes.items.forEach(item => {
      if (!bidangData[item.bidang]) {
        bidangData[item.bidang] = { name: item.bidang, nominal: 0 };
      }
      bidangData[item.bidang].nominal += item.nominal;
    });
    return Object.values(bidangData);
  }, [currentApbdes]);

  // Process chart data untuk Realisasi
  const realisasiChartData = useMemo(() => {
    if (!currentRealisasi?.items) return [];
    const bidangData: Record<string, any> = {};
    currentRealisasi.items.forEach(item => {
      if (!bidangData[item.bidang]) {
        bidangData[item.bidang] = { name: item.bidang, nominal: 0 };
      }
      bidangData[item.bidang].nominal += item.nominal;
    });
    return Object.values(bidangData);
  }, [currentRealisasi]);

  const tabs = [
    { id: 'apbdes', label: 'APBDes', icon: BarChart3 },
    { id: 'realisasi', label: 'Realisasi APBDes', icon: TrendingUp },
    { id: 'produk', label: 'Produk Hukum Desa', icon: FileText },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Logo />
          <Link href="/">
            <Button variant="ghost" className="font-bold gap-2 text-primary hover:bg-slate-100 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Beranda</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* JUDUL */}
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl font-black text-slate-900 uppercase font-display italic">Tata Kelola <span className="text-primary not-italic">Desa</span></h1>
          <p className="text-slate-500 font-bold max-w-2xl">Transparansi anggaran dan produk hukum desa Pangawaren untuk akuntabilitas publik.</p>
        </div>

        {/* TABS */}
        <div className="mb-12">
          <div className="flex gap-2 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={cn(
                  "px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all flex items-center gap-2",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* YEAR SELECTOR */}
        <div className="mb-8">
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-48 rounded-xl border-slate-300">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  Tahun {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* APBDES TAB */}
        {activeTab === 'apbdes' && (
          <div className="space-y-8">
            {isLoadingApbdes ? (
              <Skeleton className="h-96 rounded-3xl" />
            ) : currentApbdes ? (
              <>
                <Card className="rounded-[2.5rem] border-none shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">APBDes Tahun {selectedYear}</h3>
                      <p className="text-slate-600">Total Anggaran: <span className="font-black text-primary">Rp {currentApbdes.totalAnggaran.toLocaleString('id-ID')}</span></p>
                    </div>
                    
                    {apbdesChartData.length > 0 && (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={apbdesChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} />
                          <Bar dataKey="nominal" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Table Detail */}
                <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden">
                  <CardContent className="p-8">
                    <h4 className="text-xl font-black mb-6 text-slate-900">Detail Per Bidang</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-3 text-left font-bold text-slate-700">Bidang</th>
                            <th className="px-4 py-3 text-left font-bold text-slate-700">Kegiatan</th>
                            <th className="px-4 py-3 text-right font-bold text-slate-700">Nominal</th>
                            <th className="px-4 py-3 text-left font-bold text-slate-700">Sumber Anggaran</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentApbdes.items.map((item, i) => (
                            <tr key={i} className="border-b hover:bg-slate-50">
                              <td className="px-4 py-3 font-semibold text-slate-700">{item.bidang}</td>
                              <td className="px-4 py-3 text-slate-600">{item.kegiatan}</td>
                              <td className="px-4 py-3 text-right text-primary font-bold">Rp {item.nominal.toLocaleString('id-ID')}</td>
                              <td className="px-4 py-3"><Badge variant="outline">{item.sumberAnggaran}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-16 px-6">
                <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold">Data APBDes tahun {selectedYear} belum tersedia.</p>
              </div>
            )}
          </div>
        )}

        {/* REALISASI TAB */}
        {activeTab === 'realisasi' && (
          <div className="space-y-8">
            {isLoadingRealisasi ? (
              <Skeleton className="h-96 rounded-3xl" />
            ) : currentRealisasi ? (
              <>
                <Card className="rounded-[2.5rem] border-none shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Realisasi APBDes Tahun {selectedYear}</h3>
                      <p className="text-slate-600">Total Realisasi: <span className="font-black text-primary">Rp {currentRealisasi.totalRealisasi.toLocaleString('id-ID')}</span></p>
                    </div>
                    
                    {realisasiChartData.length > 0 && (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={realisasiChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} />
                          <Line type="monotone" dataKey="nominal" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Table Detail */}
                <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden">
                  <CardContent className="p-8">
                    <h4 className="text-xl font-black mb-6 text-slate-900">Detail Per Bidang</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-3 text-left font-bold text-slate-700">Bidang</th>
                            <th className="px-4 py-3 text-left font-bold text-slate-700">Kegiatan</th>
                            <th className="px-4 py-3 text-right font-bold text-slate-700">Realisasi</th>
                            <th className="px-4 py-3 text-left font-bold text-slate-700">Sumber Anggaran</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentRealisasi.items.map((item, i) => (
                            <tr key={i} className="border-b hover:bg-slate-50">
                              <td className="px-4 py-3 font-semibold text-slate-700">{item.bidang}</td>
                              <td className="px-4 py-3 text-slate-600">{item.kegiatan}</td>
                              <td className="px-4 py-3 text-right text-emerald-600 font-bold">Rp {item.nominal.toLocaleString('id-ID')}</td>
                              <td className="px-4 py-3"><Badge variant="outline">{item.sumberAnggaran}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-16 px-6">
                <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold">Data Realisasi APBDes tahun {selectedYear} belum tersedia.</p>
              </div>
            )}
          </div>
        )}

        {/* PRODUK HUKUM TAB */}
        {activeTab === 'produk' && (
          <div className="space-y-8">
            {isLoadingProduk ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-3xl" />
                ))}
              </div>
            ) : currentProdukHukum.length === 0 ? (
              <div className="text-center py-16 px-6">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold">Belum ada produk hukum tahun {selectedYear}.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProdukHukum.map(produk => (
                  <Card key={produk.id} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all">
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <Badge className="bg-primary/10 text-primary font-black uppercase text-[9px]">
                          {produk.jenis.toUpperCase()}
                        </Badge>
                        <h3 className="text-lg font-black text-slate-900 line-clamp-2">{produk.nama}</h3>
                        <p className="text-sm text-slate-600">Nomor: {produk.nomor}</p>
                      </div>
                      
                      {produk.filePdfUrl && (
                        <a href={produk.filePdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="w-full rounded-xl gap-2 text-xs font-bold">
                            <FileText className="h-4 w-4" />
                            Lihat PDF
                          </Button>
                        </a>
                      )}
                      
                      {produk.driveLink && (
                        <a href={produk.driveLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" className="w-full rounded-xl gap-2 text-xs font-bold text-primary hover:bg-primary/10">
                            <ChevronRight className="h-4 w-4" />
                            Buka di Drive
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          © 2026 Pemerintah Desa Pangawaren Digital Portal - Tata Kelola Desa
        </div>
      </footer>
    </div>
  );
}
