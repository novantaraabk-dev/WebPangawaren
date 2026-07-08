
export const PELAYANAN_CATEGORIES = [
  { id: 'visi-misi', label: 'Visi Misi dan Moto Pelayanan' },
  { id: 'maklumat', label: 'Maklumat Pelayanan' },
  { id: 'standar', label: 'Standar Pelayanan' },
  { id: 'ikm', label: 'Indeks Kepuasan Masyarakat (IKM)' },
  { id: 'survey', label: 'Survey Kepuasan Masyarakat' },
  { id: 'jenis', label: 'Jenis Pelayanan' },
  { id: 'sop', label: 'Standar Operasional Prosedur (SOP)' },
  { id: 'pojok-baca', label: 'Pojok Baca' },
];

export const getCategoryLabel = (id: string) => {
  return PELAYANAN_CATEGORIES.find(c => c.id === id)?.label || id;
};
