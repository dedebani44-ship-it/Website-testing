import type { DownloadType, MediaPreview, Platform } from '@/types/media';

const platformPatterns: Record<Exclude<Platform, 'Unknown'>, RegExp[]> = {
  TikTok: [/tiktok\.com/i, /vm\.tiktok\.com/i],
  YouTube: [/youtube\.com/i, /youtu\.be/i],
  Spotify: [/spotify\.com/i, /open\.spotify\.com/i],
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

export type Platform =
  | "youtube"
  | "tiktok"
  | "spotify"
  | "direct"
  | "unknown";

export function detectPlatform(url: string): Platform {
  try {
    const lower = url.toLowerCase();

    // YouTube
    if (
      lower.includes("youtube.com") ||
      lower.includes("youtu.be")
    ) {
      return "youtube";
    }

    // TikTok
    if (
      lower.includes("tiktok.com") ||
      lower.includes("vt.tiktok.com") ||
      lower.includes("vm.tiktok.com")
    ) {
      return "tiktok";
    }

    // Spotify
    if (
      lower.includes("spotify.com") ||
      lower.includes("open.spotify.com")
    ) {
      return "spotify";
    }

    // Direct file
    if (
      lower.match(
        /\.(mp4|mp3|wav|jpg|jpeg|png|gif|pdf|zip)$/i
      )
    ) {
      return "direct";
    }

    return "unknown";
  } catch {
    return "unknown";
  }
}

export function getPlatformLabel(platform: Platform) {
  switch (platform) {
    case "youtube":
      return "YouTube";

    case "tiktok":
      return "TikTok";

    case "spotify":
      return "Spotify";

    case "direct":
      return "Direct File";

    default:
      return "Unknown";
  }
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function createMockPreview(platform: string, url: string) {
  return {
    title: "Preview unavailable",
    author: "Unknown",
    thumbnail: "",
    duration: "--:--",
    url,
    platform,
  };
}
