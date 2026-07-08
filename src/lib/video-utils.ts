'use client';

export type VideoPlatform = 'youtube' | 'tiktok' | 'instagram' | 'unknown';

export function getVideoPlatform(url?: string): VideoPlatform | null {
  if (!url) return null;
  const normalized = url.toLowerCase();
  if (normalized.includes('youtube.com') || normalized.includes('youtu.be')) return 'youtube';
  if (normalized.includes('tiktok.com') || normalized.includes('vm.tiktok.com') || normalized.includes('m.tiktok.com')) return 'tiktok';
  if (normalized.includes('instagram.com') || normalized.includes('instagr.am')) return 'instagram';
  return 'unknown';
}

export function getVideoEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const normalized = url.trim();

  const youtubeMatch = normalized.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*?\/shorts\/))([\w-]{11})/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const tiktokMatch = normalized.match(/(?:tiktok\.com\/(?:@[^\/]+\/video\/|embed\/v\/|embed\/|v\/)|vm\.tiktok\.com\/)(\d+)/) || normalized.match(/m\.tiktok\.com\/v\/(\d+)/);
  if (tiktokMatch) {
    return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
  }

  const instagramMatch = normalized.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#&]+)/);
  if (instagramMatch) {
    const typeMatch = normalized.match(/instagram\.com\/(p|reel|tv)\//);
    const type = typeMatch?.[1] ?? 'p';
    return `https://www.instagram.com/${type}/${instagramMatch[1]}/embed`;
  }

  return null;
}

export function isSupportedVideoUrl(url?: string): boolean {
  return !!getVideoEmbedUrl(url);
}
