import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mengonversi tanggal dari database (MM/DD/YY atau format lain) 
 * ke format pengisian formulir (DD-MM-YYYY).
 */
export function formatDbDateToForm(dateStr: string | undefined): string {
  if (!dateStr) return '';
  
  const clean = dateStr.trim();
  
  // Jika format menggunakan / (biasanya Excel/DB format MM/DD/YY)
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      // Sesuai permintaan: Database MM/DD/YY -> Form DD-MM-YYYY
      let mm = parts[0].padStart(2, '0');
      let dd = parts[1].padStart(2, '0');
      let yy = parts[2];
      
      let yyyy = yy;
      if (yy.length === 2) {
        const yearNum = parseInt(yy);
        // Ambang batas 40 (1941-2040)
        yyyy = (yearNum > 40 ? '19' : '20') + yy;
      }
      return `${dd}-${mm}-${yyyy}`;
    }
  }
  
  // Jika sudah format DD-MM-YYYY (pake strip), return apa adanya
  if (clean.includes('-')) {
    return clean;
  }

  return clean;
}
