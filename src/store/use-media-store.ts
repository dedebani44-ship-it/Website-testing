'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DownloadHistoryItem, DownloadType, MediaPreview, ToastState } from '@/types/media';

interface MediaState {
  preview: MediaPreview | null;
  history: DownloadHistoryItem[];
  toast: ToastState | null;
  setPreview: (preview: MediaPreview | null) => void;
  addHistory: (preview: MediaPreview, selectedType: DownloadType) => void;
  clearHistory: () => void;
  showToast: (toast: Omit<ToastState, 'id'>) => void;
  dismissToast: () => void;
}

export const useMediaStore = create<MediaState>()(
  persist(
    (set) => ({
      preview: null,
      history: [],
      toast: null,
      setPreview: (preview) => set({ preview }),
      addHistory: (preview, selectedType) =>
        set((state) => ({
          history: [{ ...preview, selectedType }, ...state.history].slice(0, 8),
        })),
      clearHistory: () => set({ history: [] }),
      showToast: (toast) => set({ toast: { ...toast, id: Date.now() } }),
      dismissToast: () => set({ toast: null }),
    }),
    {
      name: 'glass-media-history',
      partialize: (state) => ({ history: state.history }),
    },
  ),
);
