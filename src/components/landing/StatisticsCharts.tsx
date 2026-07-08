'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const COLORS = ['#16a34a', '#0ea5a4', '#f59e0b', '#7c3aed', '#ef4444'];

export function StatisticsCharts({ residents }: { residents?: any[] | null }) {
  const firestore = useFirestore();
  const profileRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'default');
  }, [firestore]);

  const { data: profile } = useDoc<Record<string, any>>(profileRef);

  const population = residents?.length ?? 0;
  const areaKm = profile?.areaKm || profile?.area || profile?.luas || null;

  const genderData = useMemo(() => {
    const male = residents?.filter(r => (r.gender || '').toLowerCase().startsWith('l')).length ?? 0;
    const female = residents?.filter(r => (r.gender || '').toLowerCase().startsWith('p') || (r.gender || '').toLowerCase().startsWith('w')).length ?? 0;
    const other = Math.max(0, population - male - female);
    return [
      { name: 'Laki-laki', value: male },
      { name: 'Perempuan', value: female },
      ...(other > 0 ? [{ name: 'Lainnya', value: other }] : []),
    ];
  }, [residents, population]);

  const rtDistribution = useMemo(() => {
    if (!residents) return [];
    const counts: Record<string, number> = {};
    residents.forEach(r => {
      const rt = (r.rt || '0').toString();
      counts[rt] = (counts[rt] || 0) + 1;
    });
    const arr = Object.keys(counts).map(k => ({ rt: k, count: counts[k] })).sort((a, b) => a.rt.localeCompare(b.rt));
    return arr.slice(0, 12); // limit to first 12 RT for clarity
  }, [residents]);

  const renderPieLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, index } = props;
    const RADIAN = Math.PI / 180;
    const labelRadius = outerRadius + 18; // outside the donut
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);
    const value = genderData[index]?.value ?? 0;
    const pct = (percent || 0) * 100;
    const label = `${pct >= 1 ? pct.toFixed(1) : pct.toFixed(2)}%`;
    const anchor: 'start' | 'end' = x > cx ? 'start' : 'end';
    return (
      <text x={x} y={y} fill="#0f172a" textAnchor={anchor} dominantBaseline="central" style={{ fontSize: 12, fontWeight: 700 }}>
        {label}
      </text>
    );
  };

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
