'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Home, MapPin, BadgeCheck, BarChart3, PieChart as PieChartIcon, TrendingUp, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardContourPattern } from './CardContourPattern';

// Color Palette inspired by the reference vector infographic
const BAR_GRADIENTS = [
  'url(#barGrad1)',
  'url(#barGrad2)',
  'url(#barGrad3)',
  'url(#barGrad4)',
  'url(#barGrad5)',
  'url(#barGrad6)'
];

interface StatisticsChartsProps {
  statsDoc?: any;
  isLoading?: boolean;
}

export function StatisticsCharts({ statsDoc, isLoading }: StatisticsChartsProps) {
  const firestore = useFirestore();
  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profile } = useDoc<Record<string, any>>(profileRef);

  const population = statsDoc?.total ?? 0;
  const totalKK = statsDoc?.totalKK ?? (population > 0 ? Math.round(population / 4) : 0);
  const areaKm = profile?.areaKm || profile?.area || profile?.luas || null;

  const maleCount = statsDoc?.maleCount ?? 0;
  const femaleCount = statsDoc?.femaleCount ?? 0;
  const otherCount = statsDoc?.otherCount ?? 0;

  const malePct = population > 0 ? ((maleCount / population) * 100).toFixed(1) : '0.0';
  const femalePct = population > 0 ? ((femaleCount / population) * 100).toFixed(1) : '0.0';

  const genderData = useMemo(() => {
    return [
      { name: 'Laki-laki', value: maleCount },
      { name: 'Perempuan', value: femaleCount },
      ...(otherCount > 0 ? [{ name: 'Lainnya', value: otherCount }] : []),
    ];
  }, [maleCount, femaleCount, otherCount]);

  const rtDistribution = useMemo(() => {
    if (!statsDoc?.rtData || statsDoc.rtData.length === 0) {
      // Fallback default sample data if not populated yet
      return Array.from({ length: 8 }).map((_, i) => ({
        rt: `RT ${String(i + 1).padStart(2, '0')}`,
        count: Math.floor(120 + Math.sin(i + 1) * 35)
      }));
    }
    return statsDoc.rtData.slice(0, 10).map((item: any) => ({
      rt: typeof item.rt === 'number' ? `RT ${String(item.rt).padStart(2, '0')}` : String(item.rt),
      count: item.count
    }));
  }, [statsDoc]);

  if (isLoading) {
    return (
      <div className="mt-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-[2rem]" />
          ))}
        </div>
        <div className="grid lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-5 h-[420px] rounded-[2.5rem]" />
          <Skeleton className="lg:col-span-7 h-[420px] rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!statsDoc) {
    return (
      <div className="mt-8 p-10 text-center bg-white rounded-[2.5rem] border border-cyan-100 shadow-xl max-w-xl mx-auto">
        <div className="h-16 w-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-100">
          <BarChart3 className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider font-display">Data Grafik Belum Siap</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
          Rangkuman data kependudukan sedang diproses oleh Pemerintah Desa. Silakan periksa kembali di menu Data Penduduk Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      {/* TOP ROW: Infographic Leaf Cards (Pills with Icon Nodes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Card 1: Total Penduduk */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-500 to-teal-600 p-5 text-white shadow-lg shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300 group"
        >
          <CardContourPattern opacity={0.03} className="text-white" />
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-100 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Demografi
            </span>
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <h4 className="text-3xl font-black font-display tracking-tight leading-none mb-1 relative z-10">
            {population.toLocaleString('id-ID')}
          </h4>
          <p className="text-xs font-bold text-cyan-100 uppercase tracking-wider relative z-10">Total Penduduk</p>
        </motion.div>

        {/* Card 2: Jumlah KK */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 group"
        >
          <CardContourPattern opacity={0.03} className="text-white" />
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Keluarga
            </span>
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Home className="h-5 w-5" />
            </div>
          </div>
          <h4 className="text-3xl font-black font-display tracking-tight leading-none mb-1 relative z-10">
            {totalKK.toLocaleString('id-ID')}
          </h4>
          <p className="text-xs font-bold text-blue-100 uppercase tracking-wider relative z-10">Kepala Keluarga (KK)</p>
        </motion.div>

        {/* Card 3: Luas Wilayah */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-500 to-violet-600 p-5 text-white shadow-lg shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 group"
        >
          <CardContourPattern opacity={0.03} className="text-white" />
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-100 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Wilayah
            </span>
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <h4 className="text-3xl font-black font-display tracking-tight leading-none mb-1 relative z-10">
            {areaKm ? `${areaKm}` : '14.2'} <span className="text-sm font-bold">km²</span>
          </h4>
          <p className="text-xs font-bold text-purple-100 uppercase tracking-wider relative z-10">Luas Desa</p>
        </motion.div>

        {/* Card 4: RT & RW */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-500 to-rose-600 p-5 text-white shadow-lg shadow-pink-500/20 hover:-translate-y-1 transition-all duration-300 group"
        >
          <CardContourPattern opacity={0.03} className="text-white" />
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-100 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Pemerintahan
            </span>
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <BadgeCheck className="h-5 w-5" />
            </div>
          </div>
          <h4 className="text-3xl font-black font-display tracking-tight leading-none mb-1 relative z-10">
            18 <span className="text-sm font-bold">RT</span> / 6 <span className="text-sm font-bold">RW</span>
          </h4>
          <p className="text-xs font-bold text-pink-100 uppercase tracking-wider relative z-10">Wilayah RT & RW</p>
        </motion.div>

        {/* Card 5: Dusun */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white shadow-lg shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300 group sm:col-span-2 lg:col-span-1"
        >
          <CardContourPattern opacity={0.03} className="text-white" />
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-100 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Dusun
            </span>
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <h4 className="text-3xl font-black font-display tracking-tight leading-none mb-1 relative z-10">
            4 <span className="text-sm font-bold">Dusun</span>
          </h4>
          <p className="text-xs font-bold text-amber-100 uppercase tracking-wider relative z-10">Wilayah Dusun</p>
        </motion.div>
      </div>

      {/* MAIN INFOGRAPHIC CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT BOX: Donut Chart with Center Node Badge & Circular Progress Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden lg:col-span-5 rounded-[2.5rem] bg-white border border-slate-100 p-6 md:p-8 shadow-xl flex flex-col justify-between"
        >
          <CardContourPattern opacity={0.03} className="text-cyan-600" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3.5 py-1 rounded-full border border-cyan-100">
                Rasio Gender
              </span>
              <PieChartIcon className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-display italic tracking-tight">
              Komposisi <span className="text-cyan-600 not-italic">Jenis Kelamin</span>
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Perbandingan persentase penduduk laki-laki dan perempuan.
            </p>
          </div>

          {/* Donut Chart with Center Infographic Circle */}
          <div className="relative w-full h-[260px] my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="maleGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="femaleGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                  <linearGradient id="otherGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={102}
                  paddingAngle={6}
                  cornerRadius={10}
                  startAngle={90}
                  endAngle={-270}
                >
                  {genderData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? 'url(#maleGrad)' : index === 1 ? 'url(#femaleGrad)' : 'url(#otherGrad)'} 
                      stroke="#ffffff"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString('id-ID')} Jiwa`, 'Jumlah']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Circle Node (Infographic Badge) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-28 h-28 rounded-full bg-white shadow-xl border-4 border-slate-50 flex flex-col items-center justify-center text-center p-2 transform transition-transform group-hover:scale-105">
                <Users className="h-5 w-5 text-cyan-600 mb-0.5" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total</span>
                <span className="text-base font-black text-slate-900 leading-none mt-0.5 font-display">
                  {population.toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] text-slate-400 font-bold">Jiwa</span>
              </div>
            </div>
          </div>

          {/* Progress Circular Pill Badges (Inspired by reference image circular progress badges) */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-cyan-50/80 border border-cyan-100 p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                  ♂
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-cyan-700">Laki-laki</p>
                  <p className="text-sm font-black text-slate-900">{maleCount.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <span className="text-xs font-black text-cyan-600 bg-white px-2 py-0.5 rounded-full shadow-xs">
                {malePct}%
              </span>
            </div>

            <div className="bg-pink-50/80 border border-pink-100 p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                  ♀
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-pink-700">Perempuan</p>
                  <p className="text-sm font-black text-slate-900">{femaleCount.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <span className="text-xs font-black text-pink-600 bg-white px-2 py-0.5 rounded-full shadow-xs">
                {femalePct}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT BOX: Colorful Horizontal Arrow / Pill Bar Chart (Sebaran per RT) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden lg:col-span-7 rounded-[2.5rem] bg-white border border-slate-100 p-6 md:p-8 shadow-xl flex flex-col justify-between"
        >
          <CardContourPattern opacity={0.03} className="text-purple-600" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-100">
                Sebaran Wilayah
              </span>
              <TrendingUp className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-display italic tracking-tight">
              Sebaran Penduduk <span className="text-purple-600 not-italic">Per RT</span>
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Grafik alokasi jumlah penduduk pada masing-masing wilayah RT Desa Pangawaren.
            </p>
          </div>

          <div className="w-full h-[320px] my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rtDistribution} layout="vertical" margin={{ top: 10, right: 30, left: 15, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="barGrad3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                  <linearGradient id="barGrad4" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                  <linearGradient id="barGrad5" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="barGrad6" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="rt" type="category" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString('id-ID')} Jiwa`, 'Jumlah Penduduk']}
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 12, 12, 0]} 
                  barSize={18}
                >
                  {rtDistribution.map((_: any, index: number) => (
                    <Cell key={`bar-${index}`} fill={BAR_GRADIENTS[index % BAR_GRADIENTS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Metode Sensus Desa Digital</span>
            <span className="text-purple-600">Update Terpisah Per RT</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
