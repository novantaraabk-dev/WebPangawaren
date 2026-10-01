
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CardContourPattern } from '@/components/landing/CardContourPattern';
import { summarizeComplaintFeedback } from '@/ai/flows/summarize-complaint-feedback-flow';
import { Complaint, CitizenProfile } from '@/lib/types';
import {
  Loader2,
  Send,
  Lightbulb,
  MessageSquare,
  Tag,
  Calendar,
  CornerDownRight,
  User,
  MapPin,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp, query, orderBy, limit, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { getCitizenProfile } from '@/lib/citizens';

export function ComplaintSystem() {
  const [newComplaintText, setNewComplaintText] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterAddress, setReporterAddress] = useState('');
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

  const isAdmin = !!user;

  useEffect(() => {
    if (user && firestore) {
      getCitizenProfile(firestore, user.uid).then(setProfile);
    }
  }, [user, firestore]);

  const complaintsQuery = useMemoFirebase(() => {
    if (!firestore || !user || user.isAnonymous) return null;
    const baseQuery = collection(firestore, 'complaints');
    
    if (!isAdmin) {
      return query(
        baseQuery, 
        where('submitterAuthUid', '==', (user as any).uid),
        limit(100)
      );
    }

    return query(baseQuery, orderBy('submissionDate', 'desc'), limit(100));
  }, [firestore, user, isAdmin]);

  const { data: rawComplaints, isLoading: isLoadingComplaints } = useCollection<Complaint>(complaintsQuery, { realtime: true });

  const complaints = useMemo(() => {
    if (!rawComplaints) return null;
    if (isAdmin) return rawComplaints;

    return [...rawComplaints].sort((a, b) => {
      const dateA = a.submissionDate?.toMillis?.() || 0;
      const dateB = b.submissionDate?.toMillis?.() || 0;
      return dateB - dateA;
    });
  }, [rawComplaints, isAdmin]);

  const handleSubmit = async () => {
    if (!reporterName.trim() || !reporterAddress.trim() || !newComplaintText.trim()) {
      toast({
        title: 'Data Belum Lengkap',
        description: 'Silakan isi Nama, Alamat, dan isi Pengaduan Anda.',
        variant: 'destructive',
      });
      return;
    }

    if (!firestore) {
      toast({
        title: 'Gagal Mengirim',
        description: 'Koneksi ke database gagal. Coba lagi nanti.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { summary, keywords, sentiment } =
        await summarizeComplaintFeedback({
          complaintText: newComplaintText,
        });

      const complaintData = {
        description: newComplaintText,
        summaryLLM: summary,
        sentiment: sentiment,
        keywords: keywords,
        submitterAuthUid: user ? user.uid : null,
        reporterName: reporterName.toUpperCase(),
        reporterAddress: reporterAddress,
        phoneNumber: profile?.phoneNumber || '',
        email: profile?.email || '',
        status: 'New',
        submissionDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await addDoc(collection(firestore, 'complaints'), complaintData);
      
      setNewComplaintText('');
      setReporterName('');
      setReporterAddress('');
      
      toast({
        title: 'Pengaduan Terkirim',
        description: 'Terima kasih atas masukan Anda. Kami akan segera meninjau laporan ini.',
      });
    } catch (error) {
      toast({
        title: 'Gagal Mengirim',
        description: 'Terjadi kesalahan saat memproses aduan. Coba lagi nanti.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="rounded-3xl shadow-sm overflow-hidden border-none bg-white relative">
          <CardContourPattern opacity={0.03} className="text-slate-400" />
          <div className="relative z-10">
          <CardHeader className="bg-primary text-white p-8">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Buat Pengaduan</CardTitle>
            <CardDescription className="text-white/60 font-medium">
              Sampaikan keluhan atau saran Anda secara langsung kepada pemerintah desa.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Pengadu</Label>
                <Input 
                  placeholder="Nama Lengkap Anda"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-100 bg-slate-50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alamat</Label>
                <Input 
                  placeholder="Dusun / RT / RW"
                  value={reporterAddress}
                  onChange={(e) => setReporterAddress(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-100 bg-slate-50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Isi Pengaduan</Label>
                <Textarea
                  placeholder="Tuliskan keluhan atau saran Anda secara detail di sini..."
                  className="rounded-2xl border-slate-100 bg-slate-50 focus:ring-accent min-h-[150px]"
                  value={newComplaintText}
                  onChange={(e) => setNewComplaintText(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-black h-14 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-primary/20"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              KIRIM PENGADUAN
            </Button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <span className="relative bg-white px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Atau Pengaduan Cepat
              </span>
            </div>

            <a
              href="https://wa.me/6285111318412?text=Halo%20Admin%20Pelayanan%20Desa%20Pangawaren%2C%20saya%20ingin%20menyampaikan%20pengaduan."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border-2 border-emerald-500/20 bg-emerald-50/60 hover:bg-emerald-50 hover:border-emerald-500/40 transition-all duration-200 group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform shrink-0">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    Lapor via WhatsApp
                  </p>
                  <p className="text-xs font-black text-slate-800">
                    0851-1131-8412
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-black text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                Kirim WA
              </span>
            </a>
          </CardContent>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="rounded-3xl shadow-sm border-none bg-white relative overflow-hidden">
          <CardContourPattern opacity={0.03} className="text-slate-400" />
          <div className="relative z-10">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">
               {isAdmin ? 'Seluruh Pengaduan Warga' : 'Riwayat Pengaduan Saya'}
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">
              Daftar laporan yang telah dikirimkan dan status penanganannya.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-6">
            {isLoadingComplaints || !user ? (
                 <div className="space-y-4">
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                 </div>
            ) : complaints?.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed">
                    <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Belum ada pengaduan yang tercatat.</p>
                </div>
            ) : (
                <Accordion
                type="single"
                collapsible
                className="w-full space-y-4"
                >
                {complaints?.map((complaint) => (
                    <AccordionItem
                    value={complaint.id}
                    key={complaint.id}
                    className="border border-slate-100 rounded-[1.5rem] px-6 transition-all hover:border-primary/20 hover:shadow-sm"
                    >
                    <AccordionTrigger className="py-5 hover:no-underline">
                        <div className="flex flex-col gap-2 text-left w-full">
                        <div className="flex justify-between items-start gap-4">
                            <p className="text-sm font-black text-slate-800 line-clamp-1 uppercase tracking-tight">
                            {complaint.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar className="h-3 w-3" />
                            {complaint.submissionDate?.toDate().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}
                        </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-8 pt-2 pb-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <p className="font-black uppercase tracking-widest text-[10px] text-slate-400 flex items-center gap-2">
                                <User className="w-3 h-3" />
                                Identitas Pengadu
                            </p>
                            <div className="p-5 rounded-2xl bg-slate-50 text-slate-700 text-sm font-bold border border-slate-100 space-y-2">
                                <p className="uppercase">{complaint.reporterName || 'Anonim'}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-2"><MapPin className="h-3 w-3" /> {complaint.reporterAddress || '-'}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="font-black uppercase tracking-widest text-[10px] text-slate-400 flex items-center gap-2">
                                <MessageSquare className="w-3 h-3" />
                                Detail Laporan
                            </p>
                            <div className="p-5 rounded-2xl bg-slate-50 text-slate-700 text-sm font-medium border border-slate-100 leading-relaxed italic">
                                "{complaint.description}"
                            </div>
                          </div>
                        </div>

                        <div className="p-6 rounded-[2rem] border-2 border-dashed border-primary/10 bg-primary/5">
                          <h4 className="font-black uppercase tracking-widest text-[10px] text-primary mb-4 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Analisis AI Desa
                          </h4>
                          <div className="space-y-6 text-sm">
                            <div className="space-y-2">
                              <p className="font-black text-slate-900 uppercase text-[10px]">Ringkasan Masalah:</p>
                              <p className="text-slate-600 leading-relaxed font-medium italic">
                                "{complaint.summaryLLM}"
                              </p>
                            </div>
                            <div className="space-y-3">
                              <p className="font-black text-slate-900 uppercase text-[10px]">Topik Terdeteksi:</p>
                              <div className="flex flex-wrap gap-2">
                                  {complaint.keywords?.map((kw, i) => (
                                  <Badge
                                      key={i}
                                      variant="outline"
                                      className="font-bold border-primary/20 text-primary uppercase text-[9px] px-3 py-1 bg-white"
                                  >
                                      <Tag className="mr-1.5 h-2 w-2" />
                                      {kw}
                                  </Badge>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {complaint.adminResponse && (
                            <div className="p-6 rounded-[2rem] border bg-emerald-900 text-white space-y-4 shadow-xl">
                                <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-accent flex items-center gap-2">
                                    <CornerDownRight className="w-4 h-4" />
                                    Tanggapan Pemerintah Desa
                                </h4>
                                <p className="text-sm font-medium leading-relaxed italic text-emerald-50">
                                    "{complaint.adminResponse}"
                                </p>
                            </div>
                        )}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            )}
          </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
