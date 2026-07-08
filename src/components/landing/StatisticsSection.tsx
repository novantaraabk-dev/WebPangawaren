'use client';

import { motion } from 'framer-motion';
import { useMemoFirebase, useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, limit, where } from 'firebase/firestore';
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

  const residentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Remove the artificial 5000 limit so the full residents collection is queried
    return query(collection(firestore, 'residents'));
  }, [firestore]);

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

  const { data: residents, isLoading: residentsLoading, error: residentsError } = useCollection(residentsQuery);
  const { data: submissions, isLoading: submissionsLoading, error: submissionsError } = useCollection(submissionsQuery);

  const values = {
    residents: residents?.length ?? 0,
    households: Math.max(1, Math.round((residents?.length ?? 0) / 4)),
    rt: 18,
    rw: 6,
    dusun: 4,
    requests: submissions?.length ?? 0,
  };

  const hasError = Boolean(residentsError || submissionsError);

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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Statistik Desa</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Data terbaru mengenai kondisi Desa Pangawaren.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Informasi terbuka yang membantu masyarakat memahami kondisi wilayah dan perkembangan pelayanan desa.
            </p>
          </div>
          <a href="/statistik" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            Lihat dashboard lengkap
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>


        <div className="mt-12">
          <StatisticsCharts residents={residents} />
        </div>
      </div>
    </section>
  );
}
