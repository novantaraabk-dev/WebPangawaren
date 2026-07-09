export interface AntiKorupsiItem {
  id: string; // e.g. "1.1.1"
  title: string; // e.g. "RPJM Desa"
}

export interface AntiKorupsiSubMenu {
  id: string; // e.g. "1.1"
  title: string; // e.g. "Adanya Peraturan Kepala Desa (Perkades)..."
  items: AntiKorupsiItem[];
}

export interface AntiKorupsiMainMenu {
  id: string; // e.g. "1"
  title: string; // e.g. "Penguatan Tata Laksana"
  subMenus: AntiKorupsiSubMenu[];
}

export const antiKorupsiData: AntiKorupsiMainMenu[] = [
  {
    id: "1",
    title: "Penguatan Tata Laksana",
    subMenus: [
      {
        id: "1.1",
        title: "Adanya Peraturan Kepala Desa (Perkades) tentang Perencanaan, Pelaksanaan, Penatausahaan dan Pertanggungjawaban APBDes serta tentang LHKPN (setiap tahun sekali)",
        items: [
          { id: "1.1.1", title: "RPJM Desa" },
          { id: "1.1.2", title: "RKP Desa" },
          { id: "1.1.3", title: "APB Desa" },
          { id: "1.1.4", title: "APB Desa Perubahan" },
          { id: "1.1.5", title: "Laporan Pertanggungjawaban" },
          { id: "1.1.6", title: "Undangan Penyampaian Kegiatan Kepada Seluruh Perangkat Desa" },
          { id: "1.1.7", title: "Notulen/Penyusunan Kegiatan" },
          { id: "1.1.8", title: "Daftar Hadir Penyusunan Kegiatan" },
          { id: "1.1.9", title: "Dokumentasi Penyusunan Kegiatan" },
          { id: "1.1.10", title: "Penyelenggaraan LHKDes sesuai Perbup Nomor 25 Tahun 2021" }
        ]
      },
      {
        id: "1.2",
        title: "Adanya Peraturan Kepala Desa/SK Kades mengenai Mekanisme Evaluasi Kinerja Perangkat Desa",
        items: [
          { id: "1.2.1", title: "SK/Perkades Tupoksi Masing-Masing Perangkat" },
          { id: "1.2.2", title: "Peraturan tentang Mekanisme Evaluasi Perangkat Desa" },
          { id: "1.2.3", title: "Undangan Penyusunan Regulasi Mekanisme Evaluasi Perangkat Desa" },
          { id: "1.2.4", title: "Notulen, Daftar Hadir, Dokumentasi Penyusunan Regulasi" },
          { id: "1.2.5", title: "Format Form Penilaian Kerja, Hasil Monitoring, Notulen Monitoring dan Evaluasi" }
        ]
      },
      {
        id: "1.3",
        title: "Adanya Peraturan Kepala Desa/SK Kades tentang Pengendalian Gratifikasi, Suap dan Konflik Kepentingan",
        items: [
          { id: "1.3.1", title: "Peraturan tentang Pengendalian Gratifikasi, Suap dan Konflik Kepentingan" },
          { id: "1.3.2", title: "Undangan Penyusunan Regulasi Terkait Perangkat Desa" },
          { id: "1.3.3", title: "Notulen Daftar Hadir Dokumentasi Penyusunan Regulasi" },
          { id: "1.3.4", title: "Format Lampiran Gratifikasi, CD (Conflict of Interest)" }
        ]
      },
      {
        id: "1.4",
        title: "Perjanjian Kerjasama antara Pelaksana Kegiatan Anggaran dengan Pihak Ketiga dls, dan Tidak Ada Perangkat Desa yang Menjadi Pihak Ketiga",
        items: [
          { id: "1.4.1", title: "Perencanaan Pengadaan Terkait TPK" },
          { id: "1.4.2", title: "IGH - Publikasi Terkait Terkait TPK di Web/Sosial media/Mading" },
          { id: "1.4.3", title: "Undangan dan Berita Acara Penyedia" },
          { id: "1.4.4", title: "Surat Penunjukan Penyedia ke TPK" },
          { id: "1.4.5", title: "SK TPK Pelaksana Kegiatan" },
          { id: "1.4.6", title: "Perjanjian Kerjasama" },
          { id: "1.4.7", title: "Dokumen Penyelesaian Pembayaran" },
          { id: "1.4.8", title: "Foto/Dokumentasi dan Dampak Implementasi Dana Desa Terhadap Masyarakat" }
        ]
      },
      {
        id: "1.5",
        title: "Adanya Peraturan Kepala Desa/SK Kades tentang Pakta Integritas dan sejenisnya",
        items: [
          { id: "1.5.1", title: "Peraturan tentang Pakta Integritas" },
          { id: "1.5.2", title: "Dokumen Pakta Integritas yang Ditandatangani Perangkat Desa" },
          { id: "1.5.3", title: "Undangan Penyusunan Regulasi Terkait Perangkat Desa" },
          { id: "1.5.4", title: "Notulen, Daftar Hadir, Dokumentasi Penyusunan Regulasi" }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Penguatan Pengawasan",
    subMenus: [
      {
        id: "2.1",
        title: "Adanya Kegiatan Pengawasan dan Evaluasi Kinerja Perangkat Desa",
        items: [
          { id: "2.1.1", title: "Undangan Kegiatan Pengawasan dan Evaluasi Kepada Seluruh Perangkat Desa dan Aparatur Desa" },
          { id: "2.1.2", title: "Notulensi Kegiatan" },
          { id: "2.1.3", title: "Daftar Hadir" },
          { id: "2.1.4", title: "Dokumentasi" },
          { id: "2.1.5", title: "Lampiran Formulir sebagaimana tertera pada Bab I (Dok. Pendukung dgl Kinerja Perangkat dan Catatan)" }
        ]
      },
      {
        id: "2.2",
        title: "Adanya Tindak Lanjut Hasil Pembinaan, Petunjuk, Arahan, Pengawasan, dan Pemeriksaan dari Pemerintah Pusat-Daerah",
        items: [
          { id: "2.2.1", title: "Arsip/Dokumen Hasil Pembinaan, petunjuk, arahan, pengawasan, dan pemeriksaan dari pihak terkait" },
          { id: "2.2.2", title: "Surat keterangan/penjelasan tentang pembinaan, petunjuk, arahan, pengawasan dan pemeriksaan dari pihak INSPEKTORAT/BADAN dinas/pihak terkait" },
          { id: "2.2.3", title: "Surat Pernyataan/Berita Acara penyelesaian atas pembinaan, petunjuk, arahan, pengawasan dan pemeriksaan dari pemerintah pusat/daerah (pemeriksaan temuan dengan melampirkan bukti dukung)" }
        ]
      },
      {
        id: "2.3",
        title: "Tidak Adanya Aparatur Desa Dalam 3 (tiga) tahun terakhir yang terlibat Tindak Pidana Korupsi",
        items: [
          { id: "2.3.1", title: "Surat pernyataan dari Kepala Desa mengenai tidak adanya Kabupaten/Kota/Pihak Kabupaten" },
          { id: "2.3.2", title: "Surat keterangan dari APIP berdasarkan audit operasional dan sertifikasi" },
          { id: "2.3.3", title: "Surat keterangan dari pengadilan bahwa tidak dituduhkan atas tindak pidana korupsi di masa tersebut" },
          { id: "2.3.4", title: "Surat pernyataan di-Upload ke website desa" }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "Penguatan Kualitas Pelayanan Publik",
    subMenus: [
      {
        id: "3.1",
        title: "Adanya Layanan Pengaduan bagi Masyarakat",
        items: [
          { id: "3.1.1", title: "Alur mekanisme pengaduan, penanggung jawab, dan kotak saran" },
          { id: "3.1.2", title: "Saluran Penerimaan Pengaduan (Digital dan Non digital/manual tersedia kotak saran dan nomor whatsapp)" },
          { id: "3.1.3", title: "Publikasi Prosedur/Alur dan Saluran Pengaduan" },
          { id: "3.1.4", title: "Media Informasi terkait prosedur dan saluran pengaduan" }
        ]
      },
      {
        id: "3.2",
        title: "Adanya Survei Kepuasan Masyarakat (IKM) Terhadap Layanan Pemerintah Desa",
        items: [
          { id: "3.2.1", title: "Rekap Laporan hasil analisis pelayanan yang dihasilkan (survei/riset dan laporannya)" },
          { id: "3.2.2", title: "Pelaksanaan Survei berdasarkan pedoman penyusunan SKM yang dikeluarkan Kementerian yang berlaku" }
        ]
      },
      {
        id: "3.3",
        title: "Adanya Keterbukaan dan Kemudahan Akses Informasi Layanan Pemerintah Desa (Kesehatan, pendidikan, sosial, lingkungan - Surat Keterangan, perizinan umum) Pembangunan, Kependudukan, Keuangan, dan Pelayanan Lainnya",
        items: [
          { id: "3.3.1", title: "Informasi SKM sesuai Permenpan No 14 tahun 2017" },
          { id: "3.3.2", title: "Media Informasi (Poster, Banner, Website/Mading)" }
        ]
      },
      {
        id: "3.4",
        title: "Adanya Media Informasi tentang APBDes di Balai Desa dan atau tempat lain yang Mudah Diakses oleh Masyarakat",
        items: [
          { id: "3.4.1", title: "Baliho/Banner APBDes" },
          { id: "3.4.2", title: "Infografis Pembangunan" }
        ]
      },
      {
        id: "3.5",
        title: "Adanya Maklumat Pelayanan",
        items: [
          { id: "3.5.1", title: "Foto Maklumat Sesuai dengan Penerapan yang berlaku" },
          { id: "3.5.2", title: "Visi, Misi dan Maklumat Pelayanan Manual Manusia (Inovasi dan Akses Pelayanan Masyarakat/Kemandirian Desa/Kepatuhan)" },
          { id: "3.5.3", title: "Publikasi Penyampaian Maklumat Pelayanan" }
        ]
      }
    ]
  },
  {
    id: "4",
    title: "Penguatan Partisipasi Masyarakat",
    subMenus: [
      {
        id: "4.1",
        title: "Adanya Partisipasi dan Keterlibatan Masyarakat dalam Penyusunan RKP Desa",
        items: [
          { id: "4.1.1", title: "Musyawarah Pemangku Kepentingan (Dusun-Kelompok)" },
          { id: "4.1.2", title: "Musyawarah Desa" }
        ]
      },
      {
        id: "4.2",
        title: "Adanya Kesadaran Masyarakat dalam Mencegah Terjadinya Praktik Gratifikasi, Suap dan Konflik Kepentingan",
        items: [
          { id: "4.2.1", title: "Survey perilaku tidak koruptif dari masyarakat yang meliputi minimal 30 KK" },
          { id: "4.2.2", title: "Hasil pengolahan/analisis dari hasil survey" },
          { id: "4.2.3", title: "Surat edaran terkait gratifikasi, suap dan konflik kepentingan" },
          { id: "4.2.4", title: "Sosialisasi Peraturan korupsi di lingkungan masyarakat" },
          { id: "4.2.5", title: "Matriks Konflik Kepentingan yang melibatkan pihak aparatur desa (kaitan hubungan keluarga atau kedekatan dalam suatu Konflik Kepentingan)" }
        ]
      },
      {
        id: "4.3",
        title: "Adanya Keterlibatan Lembaga Kemasyarakatan dalam Pelaksanaan Pembangunan Desa",
        items: [
          { id: "4.3.1", title: "Undangan Pengumuman kepada Masyarakat" },
          { id: "4.3.2", title: "Dokumentasi Keterlibatan" },
          { id: "4.3.3", title: "Berita Acara pendampingan dan serah terima" },
          { id: "4.3.4", title: "Hasil Pelaksanaan Pembangunan Desa" }
        ]
      }
    ]
  },
  {
    id: "5",
    title: "Kearifan Lokal",
    subMenus: [
      {
        id: "5.1",
        title: "Adanya Budaya Lokal/Hukum Adat yang Mendorong Upaya Pencegahan Tindak Pidana Korupsi",
        items: [
          { id: "5.1.1", title: "Kegiatan adat istiadat/tradisi/budaya terkait pencegahan korupsi di upload di website dan media sosial" },
          { id: "5.1.2", title: "Peraturan Desa/SK tentang kearifan lokal/adat istiadat" }
        ]
      },
      {
        id: "5.2",
        title: "Adanya Tokoh Masyarakat, Tokoh Agama, Tokoh Adat, Tokoh Pemuda, dan Kaum Perempuan yang Mendorong Upaya Pencegahan Tindak Pidana Korupsi",
        items: [
          { id: "5.2.1", title: "SK/Penetapan - Surat Pernyataan Tokoh masyarakat, tokoh agama, tokoh adat, tokoh pemuda, kaum perempuan yang mendukung upaya pencegahan korupsi" },
          { id: "5.2.2", title: "Dokumentasi Dukungan (pernyataan), tokoh agama, tokoh adat, tokoh pemuda, kaum perempuan" },
          { id: "5.2.3", title: "Publikasi terkait keterlibatan di media sosial" },
          { id: "5.2.4", title: "Pakta integritas terkait dalam mendorong upaya pencegahan korupsi" }
        ]
      }
    ]
  }
];
