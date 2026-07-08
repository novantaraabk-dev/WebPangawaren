/**
 * HELPER: Format Excel untuk Import APBDes dan Realisasi APBDes
 * 
 * Format kolom yang diharapkan di Excel:
 * 1. Bidang - string (e.g., "Perangkat Desa", "Sekretariat", "Kasi Pemerintahan")
 * 2. Kode Rekening - string (e.g., "1.1.01.01.01.0000")
 * 3. Kegiatan - string (deskripsi kegiatan)
 * 4. Volume - number (jumlah volume)
 * 5. Nominal - number (dalam Rupiah, tanpa format)
 * 6. Sumber Anggaran - string (e.g., "APBDes", "APBDn", "Pendapatan Asli Desa")
 * 
 * CONTOH DATA:
 * 
 * UNTUK APBDES:
 * Bidang | Kode Rekening | Kegiatan | Volume | Nominal | Sumber Anggaran
 * Perangkat Desa | 1.1.01.01.01.0000 | Tunjangan Kepala Desa | 1 | 10000000 | APBDes
 * Perangkat Desa | 1.1.01.01.02.0000 | Tunjangan Perangkat | 7 | 35000000 | APBDes
 * Sekretariat | 1.1.02.01.01.0000 | Operasional Kantor | 1 | 50000000 | APBDes
 * 
 * UNTUK REALISASI APBDES:
 * Bidang | Kode Rekening | Kegiatan | Volume | Nominal | Sumber Anggaran
 * Perangkat Desa | 1.1.01.01.01.0000 | Tunjangan Kepala Desa | 1 | 10000000 | APBDes
 * Perangkat Desa | 1.1.01.01.02.0000 | Tunjangan Perangkat | 7 | 35000000 | APBDes
 * Sekretariat | 1.1.02.01.01.0000 | Operasional Kantor | 1 | 48000000 | APBDes
 * 
 * CARA MENGGUNAKAN:
 * 1. Buka Admin > Tata Kelola Desa
 * 2. Pilih tahun
 * 3. Klik "Impor Excel"
 * 4. Pilih file Excel dengan format di atas
 * 5. Data otomatis tersimpan di Firestore
 * 
 * CATATAN PENTING:
 * - Nama kolom harus TEPAT: "Bidang", "Kode Rekening", "Kegiatan", "Volume", "Nominal", "Sumber Anggaran"
 * - Kolom Nominal dan Volume harus angka (number format di Excel)
 * - Satu baris per kegiatan
 * - File format: .xlsx atau .xls
 */

export const EXCEL_FORMAT_EXAMPLE = `
Bidang,Kode Rekening,Kegiatan,Volume,Nominal,Sumber Anggaran
Perangkat Desa,1.1.01.01.01.0000,Tunjangan Kepala Desa,1,10000000,APBDes
Perangkat Desa,1.1.01.01.02.0000,Tunjangan Perangkat,7,35000000,APBDes
Sekretariat Desa,1.1.02.01.01.0000,Operasional Kantor,1,50000000,APBDes
Kasi Pemerintahan,1.1.03.01.01.0000,Kegiatan Pemerintahan,1,30000000,APBDes
Kasi Pemberdayaan,1.1.04.01.01.0000,Program Pemberdayaan,1,40000000,APBDes
`;
