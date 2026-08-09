'use client';

import { motion } from 'framer-motion';
import { useMemoFirebase, useCollection, useDoc, useFirestore, useUser } from '@/firebase';
import { collection, query, limit, where, doc } from 'firebase/firestore';
import { ArrowUpRight, Home, Users, FileText, BarChart3, BadgeCheck, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatisticsCharts } from './StatisticsCharts';

const metrics = [
  { label: 'Jumlah Penduduk', icon: Users, accent: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Jumlah KK', icon: Home, accent: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'RT', icon: BadgeCheck, accent: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'RW', icon: BarChart3, accent: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Dusun', icon: MapPin, accent: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Pelayanan Diajukan', icon: FileText, accent: 'text-slate-700', bg: 'bg-slate-100' },
];

export function StatisticsSection() {
  const firestore = useFirestore();

  const statsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'villageProfile', 'statistics');
  }, [firestore]);

  const { data: statsDoc, isLoading: statsLoading, error: statsError } = useDoc<any>(statsRef);

  const { user } = useUser();

  // Only request the current user's letter requests when signed in to satisfy Firestore rules.
  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore || !user || user.isAnonymous) return null;
    return query(
      collection(firestore, 'letterRequests'),
      where('requestorAuthUid', '==', user.uid),
      limit(5000)
    );
  }, [firestore, user]);

  const { data: submissions, isLoading: submissionsLoading, error: submissionsError } = useCollection(submissionsQuery);

  const values = {
    residents: statsDoc?.total ?? 0,
    households: statsDoc?.totalKK ?? 0,
    rt: 18,
    rw: 6,
    dusun: 4,
    requests: submissions?.length ?? 0,
  };

  const hasError = Boolean(statsError || submissionsError);

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 text-cyan-700 px-4 py-1.5 rounded-full mb-3 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest">Infografik & Statistik Desa</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-display italic tracking-tight">
              Visualisasi Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 not-italic">Desa Pangawaren</span>
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-600 font-medium">
              Informasi statistik terbuka dan transparan mengenai kondisi demografi kependudukan, wilayah RT/RW, dan perkembangan Desa Pangawaren.
            </p>
          </div>
          <a 
            href="/statistik" 
            className="inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3.5 rounded-2xl shadow-lg shadow-cyan-600/20 hover:scale-105 transition-all duration-300"
          >
            Dashboard Lengkap
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>


        <div className="mt-12">
          <StatisticsCharts statsDoc={statsDoc} isLoading={statsLoading} />
        </div>
      </div>
    </section>
  );
}
