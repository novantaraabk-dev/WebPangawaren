'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Users,
  FileUp,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Database,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Resident } from '@/lib/types';
import { useFirestore } from '@/firebase';
import {
  collection,
  query,
  deleteDoc,
  doc,
  getDocs,
  where,
  limit,
  getCountFromServer,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ResidentForm } from './resident-form';
import { ImportResidentDialog } from './import-resident-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { seedResidents, recalculateStatistics } from '@/lib/residents';

export function ResidentList() {
  console.log('ResidentList render');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const [residents, setResidents] = useState<Resident[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const getExportDataList = async (scope: 'view' | 'all'): Promise<Resident[]> => {
    if (scope === 'view' && residents.length > 0) {
      return residents;
    }
    if (!firestore) return [];

    const snapshot = await getDocs(collection(firestore, 'residents'));
    const list: Resident[] = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as Resident));
    return list;
  };

  const handleExportExcel = async (scope: 'view' | 'all' = 'view') => {
    setIsExportingExcel(true);
    toast({ title: "Memproses Ekspor Excel...", description: "Mohon tunggu sebentar data sedang disiapkan." });

    try {
      const dataList = await getExportDataList(scope);
      if (dataList.length === 0) {
        toast({ title: "Data Kosong", description: "Tidak ada data penduduk yang bisa diekspor.", variant: "destructive" });
        return;
      }

      const rows = dataList.map((r, index) => ({
        'No': index + 1,
        'NIK': r.nik || '',
        'No. KK': r.noKk || '',
        'Nama Lengkap': (r.fullName || '').toUpperCase(),
        'Jenis Kelamin': r.gender || '',
        'Tempat Lahir': r.placeOfBirth || '',
        'Tanggal Lahir': r.dateOfBirth || '',
        'Agama': r.religion || '',
        'Status Perkawinan': r.maritalStatus || '',
        'Pekerjaan': r.occupation || '',
        'Hubungan Keluarga (SHDK)': r.relationshipToHeadOfFamily || '',
        'RT': r.rt || '',
        'RW': r.rw || '',
        'Dusun': (r as any).dusun || '',
        'Alamat': r.address || '',
        'Pendidikan': (r as any).education || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Penduduk');

      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Data_Penduduk_Desa_Pangawaren_${dateStr}.xlsx`);

      toast({ title: "Ekspor Excel Berhasil", description: `${rows.length} data penduduk berhasil diunduh.` });
    } catch (error: any) {
      console.error("Export Excel error:", error);
      toast({ title: "Gagal Ekspor Excel", description: error.message, variant: "destructive" });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPdf = async (scope: 'view' | 'all' = 'view') => {
    setIsExportingPdf(true);
    toast({ title: "Memproses Ekspor PDF...", description: "Mohon tunggu dokumen PDF sedang dibuat." });

    try {
      const dataList = await getExportDataList(scope);
      if (dataList.length === 0) {
        toast({ title: "Data Kosong", description: "Tidak ada data penduduk yang bisa diekspor.", variant: "destructive" });
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Title Header
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PEMERINTAH KABUPATEN CILACAP', doc.internal.pageSize.width / 2, 12, { align: 'center' });
      doc.setFontSize(12);
      doc.text('KECAMATAN KARANGPUCUNG - DESA PANGAWAREN', doc.internal.pageSize.width / 2, 18, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('LAPORAN DATA KEPENDUDUKAN DESA PANGAWAREN', doc.internal.pageSize.width / 2, 23, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(14, 26, doc.internal.pageSize.width - 14, 26);

      const tableColumn = ["No", "NIK", "No. KK", "Nama Lengkap", "JK", "Tgl Lahir", "Agama", "SHDK", "Alamat / RT RW"];
      const tableRows = dataList.map((r, index) => [
        index + 1,
        r.nik || '-',
        r.noKk || '-',
        (r.fullName || '-').toUpperCase(),
        r.gender || '-',
        r.dateOfBirth || '-',
        r.religion || '-',
        r.relationshipToHeadOfFamily || '-',
        `${r.address || ''} RT ${r.rt || '-'}/RW ${r.rw || '-'}`
      ]);

      autoTable(doc, {
        startY: 29,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
        columnStyles: {
          0: { halign: 'center', cellWidth: 8 },
          1: { cellWidth: 28 },
          2: { cellWidth: 28 },
          3: { fontStyle: 'bold' },
          4: { halign: 'center', cellWidth: 10 },
          5: { halign: 'center', cellWidth: 22 },
          6: { cellWidth: 18 },
          7: { cellWidth: 26 },
        }
      });

      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.text(
          `Halaman ${i} dari ${totalPages} - Dicetak dari Sistem Digital Pangawaren (${new Date().toLocaleDateString('id-ID')})`,
          doc.internal.pageSize.width - 14,
          doc.internal.pageSize.height - 8,
          { align: 'right' }
        );
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      doc.save(`Data_Penduduk_Desa_Pangawaren_${dateStr}.pdf`);

      toast({ title: "Ekspor PDF Berhasil", description: `${dataList.length} data penduduk berhasil diunduh.` });
    } catch (error: any) {
      console.error("Export PDF error:", error);
      toast({ title: "Gagal Ekspor PDF", description: error.message, variant: "destructive" });
    } finally {
      setIsExportingPdf(false);
    }
  };
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const firestore = useFirestore();
  const { toast } = useToast();

  const fetchTotalCount = async () => {
    if (!firestore) return;
    try {
      const coll = collection(firestore, 'residents');
      const snapshot = await getCountFromServer(coll);
      setTotalCount(snapshot.data().count);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  useEffect(() => { if (firestore) fetchTotalCount(); }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!firestore) return;

    const term = searchTerm.trim();
    if (!term) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const residentsCol = collection(firestore, 'residents');

      if (/^\d{16}$/.test(term)) {
        const docRef = doc(firestore, 'residents', term);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setResidents([{ id: docSnap.id, ...docSnap.data() } as Resident]);
          setIsSearching(false);
          return;
        }

        const qNik = query(residentsCol, where('nik', '==', term), limit(1));
        const snapNik = await getDocs(qNik);
        if (!snapNik.empty) {
          const results: Resident[] = [];
          snapNik.forEach(d => results.push({ id: d.id, ...d.data() } as Resident));
          setResidents(results);
          setIsSearching(false);
          return;
        }
      }

      const nameTerm = term.toUpperCase();
      const qName = query(
        residentsCol,
        where('fullName', '>=', nameTerm),
        where('fullName', '<=', nameTerm + '\uf8ff'),
        limit(20)
      );

      const querySnapshot = await getDocs(qName);
      const results: Resident[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Resident);
      });

      setResidents(results);

      if (results.length === 0) {
        toast({
          title: "Tidak Ditemukan",
          description: `Data "${term}" tidak ada di database.`,
        });
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        variant: "destructive",
        title: "Gagal Mencari",
        description: "Terjadi kesalahan kuota atau jaringan."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'residents', id));
      setResidents(residents.filter(r => r.id !== id));
      if (totalCount !== null) setTotalCount(totalCount - 1);

      // Update demographic cache
      await recalculateStatistics(firestore);

      toast({ title: "Data Dihapus", description: "Data warga telah dihapus." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal Menghapus", description: error.message });
    }
  };

  const handleDeleteAll = async () => {
    if (!firestore) return;
    setIsDeletingAll(true);

    try {
      const residentsCol = collection(firestore, 'residents');
      const snapshot = await getDocs(residentsCol);

      if (snapshot.empty) {
        toast({ title: "Database Kosong", description: "Tidak ada data yang bisa dihapus." });
        setIsDeletingAll(false);
        return;
      }

      let count = 0;
      const chunks = [];
      const allDocs = snapshot.docs;
      for (let i = 0; i < allDocs.length; i += 500) chunks.push(allDocs.slice(i, i + 500));

      for (const chunk of chunks) {
        const batch = writeBatch(firestore);
        chunk.forEach((d) => {
          batch.delete(d.ref);
          count++;
        });
        await batch.commit();
      }

      // Update demographic cache
      await recalculateStatistics(firestore);

      setResidents([]);
      setTotalCount(0);
      toast({ title: "Berhasil", description: `${count} data penduduk telah dihapus permanen.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal Menghapus Semua", description: error.message });
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleSeedData = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
      await seedResidents(firestore);
      await recalculateStatistics(firestore);
      await fetchTotalCount();
      toast({
        title: "Data Testing Berhasil",
        description: "Beberapa data contoh telah ditambahkan ke database.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Menambah Data",
        description: error.message,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRecalculate = async () => {
    if (!firestore) return;
    setIsRecalculating(true);
    try {
      await recalculateStatistics(firestore);
      await fetchTotalCount();
      toast({
        title: "Statistik Diperbarui",
        description: "Statistik kependudukan berhasil dihitung ulang dan disimpan.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Memperbarui Statistik",
        description: error.message,
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingResident(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Statistik Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCount === null ? <Skeleton className="h-8 w-16" /> : totalCount.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground italic">Total dokumen penduduk</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>Sistem dioptimalkan untuk mencari berdasarkan <strong>NIK 16 digit</strong> atau <strong>Nama Depan</strong>. Database tidak dimuat semua sekaligus demi kecepatan dan penghematan kuota.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Masukkan NIK atau Nama..."
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isSearching}
            />
          </div>
          <Button type="submit" size="lg" className="px-8" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            Cari
          </Button>
        </form>

        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeletingAll || totalCount === 0}>
                  {isDeletingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Hapus Semua Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-red-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <ShieldAlert className="h-5 w-5" />
                    PERINGATAN KERAS!
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-4">
                      <p className="font-bold text-red-900">Tindakan ini akan menghapus SELURUH ({totalCount ?? 0}) data penduduk dari server secara permanen.</p>
                      <p>Pastikan Anda sudah memiliki cadangan data (backup) sebelum melanjutkan. Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} className="bg-red-600 text-white hover:bg-red-700">Ya, Hapus Semua Selamanya</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" size="sm" onClick={handleSeedData} disabled={isSeeding}>
              {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              Generate Data Testing
            </Button>

            <Button variant="outline" size="sm" onClick={handleRecalculate} disabled={isRecalculating} className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
              {isRecalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
              Update Statistik Grafik
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold" disabled={isExportingExcel}>
                  {isExportingExcel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />}
                  Ekspor Excel
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs uppercase font-bold text-slate-400">Pilihan Ekspor Excel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExportExcel('view')} disabled={residents.length === 0}>
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>Ekspor Data Tampil ({residents.length})</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportExcel('all')}>
                  <Download className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>Ekspor Semua Database ({totalCount ?? 0})</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-red-600 text-red-700 hover:bg-red-50 font-bold" disabled={isExportingPdf}>
                  {isExportingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4 text-red-600" />}
                  Ekspor PDF
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs uppercase font-bold text-slate-400">Pilihan Ekspor PDF</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExportPdf('view')} disabled={residents.length === 0}>
                  <FileText className="mr-2 h-4 w-4 text-red-600" />
                  <span>Ekspor Data Tampil ({residents.length})</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportPdf('all')}>
                  <Download className="mr-2 h-4 w-4 text-red-600" />
                  <span>Ekspor Semua Database ({totalCount ?? 0})</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
              <FileUp className="mr-2 h-4 w-4" />
              Impor Excel
            </Button>
            <Button variant="secondary" size="sm" onClick={handleAdd}>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Manual
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>NIK</TableHead>
                <TableHead>KK</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Tgl Lahir</TableHead>
                <TableHead>JK</TableHead>
                <TableHead>Agama</TableHead>
                <TableHead>SHDK</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSearching ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={9}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                ))
              ) : residents.length > 0 ? (
                residents.map((resident) => (
                  <TableRow key={resident.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-[10px]">{resident.nik}</TableCell>
                    <TableCell className="font-mono text-[10px]">{resident.noKk}</TableCell>
                    <TableCell className="font-medium uppercase text-[10px]">{resident.fullName}</TableCell>
                    <TableCell className="text-[10px] whitespace-nowrap">{resident.dateOfBirth}</TableCell>
                    <TableCell className="text-[10px]">{resident.gender || '-'}</TableCell>
                    <TableCell className="text-[10px]">{resident.religion || '-'}</TableCell>
                    <TableCell className="text-[10px] font-semibold">{resident.relationshipToHeadOfFamily || '-'}</TableCell>
                    <TableCell className="text-[10px] min-w-[300px]">
                      <p className="leading-tight truncate">
                        {`${resident.address}, RT ${resident.rt} RW ${resident.rw}, ${resident.kelurahan}Kec. Karangpucung, Kab. Cilacap`}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(resident)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div className="flex w-full items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 cursor-default">
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
                                <AlertDialogDescription>Data {resident.fullName} akan dihapus permanen.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(resident.id)} className="bg-red-600 text-white">Ya, Hapus</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center text-muted-foreground">
                    {hasSearched ? "Data tidak ditemukan." : "Gunakan pencarian untuk menampilkan data."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ResidentForm open={isFormOpen} onOpenChange={setIsFormOpen} resident={editingResident} />
      <ImportResidentDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
    </div>
  );
}
