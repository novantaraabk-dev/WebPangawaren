'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#16a34a', '#0ea5a4', '#f59e0b', '#7c3aed', '#ef4444'];

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
  const areaKm = profile?.areaKm || profile?.area || profile?.luas || null;

  const genderData = useMemo(() => {
    const male = statsDoc?.maleCount ?? 0;
    const female = statsDoc?.femaleCount ?? 0;
    const other = statsDoc?.otherCount ?? 0;
    return [
      { name: 'Laki-laki', value: male },
      { name: 'Perempuan', value: female },
      ...(other > 0 ? [{ name: 'Lainnya', value: other }] : []),
    ];
  }, [statsDoc]);

  const rtDistribution = useMemo(() => {
    if (!statsDoc?.rtData) return [];
    return statsDoc.rtData.slice(0, 12);
  }, [statsDoc]);

  const renderPieLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index } = props;
    const RADIAN = Math.PI / 180;
    const labelRadius = outerRadius + 18; // outside the donut
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
    const pct = (percent || 0) * 100;
    const label = `${pct >= 1 ? pct.toFixed(1) : pct.toFixed(2)}%`;
    const anchor: 'start' | 'end' = x > cx ? 'start' : 'end';
    return (
      <text x={x} y={y} fill="#0f172a" textAnchor={anchor} dominantBaseline="central" style={{ fontSize: 12, fontWeight: 700 }}>
        {label}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[240px] rounded-[1.5rem]" />
        <Skeleton className="h-[240px] rounded-[1.5rem]" />
        <Skeleton className="h-[240px] rounded-[1.5rem]" />
      </div>
    );
  }

  if (!statsDoc) {
    return (
      <div className="mt-8 p-8 text-center bg-white rounded-[1.5rem] border border-emerald-600/20 shadow-sm max-w-lg mx-auto">
        <p className="text-sm font-semibold text-slate-700">Data Statistik Belum Siap</p>
        <p className="text-xs text-slate-500 mt-2">
          Administrator belum membuat rangkuman data kependudukan. Selesaikan langkah ini dengan mengklik tombol &quot;Update Statistik Grafik&quot; di menu Data Penduduk Admin.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45 }}
        className="rounded-[1.5rem] border border-emerald-600/20 bg-white p-6 shadow-sm lg:col-span-1"
      >
        <h4 className="text-sm font-semibold text-slate-700">Kilas Data Wilayah</h4>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">Jumlah Penduduk</div>
            <div className="text-lg font-bold text-slate-900">{population.toLocaleString('id-ID')}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">Luas Wilayah</div>
            <div className="text-lg font-bold text-slate-900">{areaKm ? `${areaKm} km²` : '—'}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">Jumlah KK (perkiraan)</div>
            <div className="text-lg font-bold text-slate-900">{Math.max(1, Math.round(population / 4)).toLocaleString('id-ID')}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="rounded-[1.5rem] border border-emerald-600/20 bg-white p-6 shadow-sm lg:col-span-1"
      >
        <h4 className="text-sm font-semibold text-slate-700">Komposisi Jenis Kelamin</h4>
        <div style={{ width: '100%', height: 240 }} className="mt-4">
          <ResponsiveContainer>
            <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                outerRadius={60}
                innerRadius={30}
                fill="#8884d8"
                labelLine={true}
                label={renderPieLabel}
                paddingAngle={4}
                startAngle={90}
                endAngle={-270}
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toLocaleString('id-ID')} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ marginTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        className="rounded-[1.5rem] border border-emerald-600/20 bg-white p-6 shadow-sm lg:col-span-1"
      >
        <h4 className="text-sm font-semibold text-slate-700">Sebaran Penduduk per RT</h4>
        <div style={{ width: '100%', height: 240 }} className="mt-3">
          <ResponsiveContainer>
            <BarChart data={rtDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rt" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toLocaleString('id-ID')} />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
