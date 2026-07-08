import type { Announcement, Complaint, LetterSubmission } from './types';

export const letterTypes = [
  'Surat Keterangan Umum',
  'Surat Keterangan Tidak Mampu',
  'Surat Pengantar SKCK',
  'Surat Pengantar Pindah',
  'Surat Keterangan Usaha',
  'Surat Keterangan Kelahiran',
  'Surat Keterangan Kematian',
  'Surat Keterangan Belum Menikah',
  'Surat Keterangan Domisili',
  'Surat Ijin Keramaian',
  'Surat Keterangan Moyang',
  'Surat Keterangan Pemakaman',
  'Surat Keterangan Wali',
  'Surat Keterangan Reaktivasi BPJS Kesehatan',
  'Surat Pengantar Umum',
];

export const initialComplaints: Complaint[] = [
    {
        id: '1',
        description: 'Jalan di RT 03/RW 02 rusak parah and berlubang. Sangat berbahaya bagi pengendara motor terutama di malam hari. Mohon segera diperbaiki.',
        submissionDate: null as any,
        summaryLLM: 'Warga mengeluhkan jalan rusak dan berlubang di RT 03/RW 02 yang membahayakan pengendara, meminta perbaikan segera.',
        sentiment: 'negative',
        keywords: ['jalan rusak', 'berlubang', 'berbahaya', 'perbaikan'],
    },
    {
        id: '2',
        description: 'Saya ingin memberikan masukan agar di area taman desa ditambahkan lebih banyak tempat sampah. Saat ini seringkali sampah berserakan karena kurangnya fasilitas.',
        submissionDate: null as any,
        summaryLLM: 'Warga memberikan saran untuk menambah jumlah tempat sampah di area taman desa untuk mengatasi masalah sampah yang berserakan.',
        sentiment: 'neutral',
        keywords: ['tempat sampah', 'taman desa', 'fasilitas', 'kebersihan'],
    }
];

export const initialSubmissions: LetterSubmission[] = [
 
];
