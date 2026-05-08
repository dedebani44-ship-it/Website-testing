export type Platform = 'TikTok' | 'YouTube' | 'Spotify' | 'Unknown';

export type DownloadType = 'video' | 'audio' | 'thumbnail';

export interface MediaPreview {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  creator: string;
  duration: string;
  thumbnail: string;
  accent: string;
  description: string;
  createdAt: string;
}

export interface DownloadHistoryItem extends MediaPreview {
  selectedType: DownloadType;
}

export interface ToastState {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}
