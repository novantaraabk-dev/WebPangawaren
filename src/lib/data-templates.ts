/**
 * TEMPLATE: Export APBDes/Realisasi ke CSV Format (untuk download reference)
 * Pengguna bisa menggunakan ini sebagai template untuk membuat Excel
 */

export function generateApbdesTemplate() {
  const template = [
    ['Bidang', 'Kode Rekening', 'Kegiatan', 'Volume', 'Nominal', 'Sumber Anggaran'],
    ['Perangkat Desa', '1.1.01.01.01.0000', 'Tunjangan Kepala Desa', 1, 10000000, 'APBDes'],
    ['Perangkat Desa', '1.1.01.01.02.0000', 'Tunjangan Perangkat', 7, 35000000, 'APBDes'],
    ['Perangkat Desa', '1.1.01.01.03.0000', 'Tunjangan BPD', 1, 5000000, 'APBDes'],
    ['Sekretariat Desa', '1.1.02.01.01.0000', 'Operasional Kantor', 1, 50000000, 'APBDes'],
    ['Sekretariat Desa', '1.1.02.01.02.0000', 'Perawatan Kendaraan', 1, 15000000, 'APBDes'],
    ['Kasi Pemerintahan', '1.1.03.01.01.0000', 'Keamanan dan Ketertiban', 1, 30000000, 'APBDes'],
    ['Kasi Pemerintahan', '1.1.03.01.02.0000', 'Pembinaan Masyarakat', 1, 25000000, 'APBDes'],
    ['Kasi Pemberdayaan', '1.1.04.01.01.0000', 'Program Pemberdayaan UMKM', 1, 40000000, 'APBDes'],
    ['Kasi Pemberdayaan', '1.1.04.01.02.0000', 'Pelatihan Keterampilan', 1, 20000000, 'APBDes'],
    ['Kasi Pembangunan', '1.1.05.01.01.0000', 'Pembangunan Infrastruktur', 1, 100000000, 'APBDes'],
  ];
  
  return template;
}

export function generateRealisasiTemplate() {
  const template = [
    ['Bidang', 'Kode Rekening', 'Kegiatan', 'Volume', 'Nominal', 'Sumber Anggaran'],
    ['Perangkat Desa', '1.1.01.01.01.0000', 'Tunjangan Kepala Desa', 1, 10000000, 'APBDes'],
    ['Perangkat Desa', '1.1.01.01.02.0000', 'Tunjangan Perangkat', 7, 35000000, 'APBDes'],
    ['Perangkat Desa', '1.1.01.01.03.0000', 'Tunjangan BPD', 1, 4500000, 'APBDes'],
    ['Sekretariat Desa', '1.1.02.01.01.0000', 'Operasional Kantor', 1, 48000000, 'APBDes'],
    ['Sekretariat Desa', '1.1.02.01.02.0000', 'Perawatan Kendaraan', 1, 14000000, 'APBDes'],
    ['Kasi Pemerintahan', '1.1.03.01.01.0000', 'Keamanan dan Ketertiban', 1, 28000000, 'APBDes'],
    ['Kasi Pemerintahan', '1.1.03.01.02.0000', 'Pembinaan Masyarakat', 1, 22000000, 'APBDes'],
    ['Kasi Pemberdayaan', '1.1.04.01.01.0000', 'Program Pemberdayaan UMKM', 1, 38000000, 'APBDes'],
    ['Kasi Pemberdayaan', '1.1.04.01.02.0000', 'Pelatihan Keterampilan', 1, 18000000, 'APBDes'],
    ['Kasi Pembangunan', '1.1.05.01.01.0000', 'Pembangunan Infrastruktur', 1, 95000000, 'APBDes'],
  ];
  
  return template;
}
