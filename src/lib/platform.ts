import type { DownloadType, MediaPreview, Platform } from '@/types/media';

const platformHostPatterns: Record<Exclude<Platform, 'Unknown'>, RegExp[]> = {
  TikTok: [/(^|\.)tiktok\.com$/],
  YouTube: [/(^|\.)youtube\.com$/, /^youtu\.be$/],
  Spotify: [/(^|\.)spotify\.com$/],
};

const platformCopy: Record<Platform, Pick<MediaPreview, 'title' | 'creator' | 'duration' | 'thumbnail' | 'accent' | 'description'>> = {
  TikTok: {
    title: 'Viral short-form video preview',
    creator: '@creative.studio',
    duration: '00:42',
    thumbnail: 'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-tiktok via-cyan-300 to-pink-500',
    description: 'Mock TikTok card with privacy-safe metadata for frontend demonstration only.',
  },
  YouTube: {
    title: 'Cinematic creator episode preview',
    creator: 'Northstar Channel',
    duration: '12:34',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-youtube via-rose-500 to-orange-400',
    description: 'Mock YouTube card with download options represented as UI placeholders.',
  },
  Spotify: {
    title: 'Premium audio session preview',
    creator: 'Midnight Frequency',
    duration: '03:18',
    thumbnail: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-spotify via-emerald-300 to-cyber',
    description: 'Mock Spotify card focused on compliant frontend flow and local history.',
  },
  Unknown: {
    title: 'Unsupported media link',
    creator: 'Paste TikTok, YouTube, or Spotify URL',
    duration: '--:--',
    thumbnail: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-slate-500 via-aurora to-cyber',
    description: 'We could not identify the platform. Try a public TikTok, YouTube, or Spotify URL.',
  },
};

export const downloadOptions: Array<{ type: DownloadType; label: string; helper: string }> = [
  { type: 'video', label: 'Video', helper: 'Mock MP4 option' },
  { type: 'audio', label: 'Audio', helper: 'Mock MP3 option' },
  { type: 'thumbnail', label: 'Thumbnail', helper: 'Mock image option' },
];

export function detectPlatform(value: string): Platform {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

    for (const [platform, patterns] of Object.entries(platformHostPatterns) as Array<[Exclude<Platform, 'Unknown'>, RegExp[]]>) {
      if (patterns.some((pattern) => pattern.test(hostname))) {
        return platform;
      }
    }
  } catch {
    return 'Unknown';
  }

  return 'Unknown';
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

export async function createMockPreview(url: string): Promise<MediaPreview> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const platform = detectPlatform(url);
  const copy = platformCopy[platform];

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${platform.toLowerCase()}-${Date.now()}`,
    url,
    platform,
    createdAt: new Date().toISOString(),
    ...copy,
  };
}
