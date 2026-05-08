'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  FileAudio,
  FileVideo,
  History,
  Image as ImageIcon,
  Link2,
  Loader2,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';
import { getFilenameFromDisposition, triggerBrowserDownload } from '@/lib/download-file';
import { detectPlatform, downloadOptions, isValidUrl } from '@/lib/platform';
import { useMediaStore } from '@/store/use-media-store';
import type { DownloadHistoryItem, DownloadType, MediaPreview, Platform } from '@/types/media';

const platformTone: Record<Platform, string> = {
  TikTok: 'border-cyan-300/30 bg-cyan-300/15 text-cyan-700 dark:text-cyan-100',
  YouTube: 'border-rose-300/30 bg-rose-400/15 text-rose-700 dark:text-rose-100',
  Spotify: 'border-emerald-300/30 bg-emerald-400/15 text-emerald-700 dark:text-emerald-100',
  Unknown: 'border-slate-300/50 bg-slate-500/10 text-slate-600 dark:text-slate-200',
};

const platformGlow: Record<Platform, string> = {
  TikTok: 'from-cyan-400/30 via-fuchsia-400/20 to-rose-400/20',
  YouTube: 'from-rose-500/30 via-orange-400/20 to-amber-300/20',
  Spotify: 'from-emerald-400/30 via-lime-300/20 to-cyan-300/20',
  Unknown: 'from-slate-400/20 via-violet-400/20 to-cyan-300/20',
};

const optionIcons: Record<DownloadType, typeof FileVideo> = {
  video: FileVideo,
  audio: FileAudio,
  thumbnail: ImageIcon,
};

function getPlatformLabel(platform: Platform) {
  return platform === 'Unknown' ? 'Unknown platform' : platform;
}

export function MediaDashboard() {
  const [url, setUrl] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [downloadingType, setDownloadingType] = useState<DownloadType | null>(null);
  const [inputTouched, setInputTouched] = useState(false);
  const lastAnalyzedUrl = useRef('');
  const requestIdRef = useRef(0);
  const autoToastRef = useRef(false);
  const mounted = useMounted();

  const preview = useMediaStore((state) => state.preview);
  const history = useMediaStore((state) => state.history);
  const setPreview = useMediaStore((state) => state.setPreview);
  const addHistory = useMediaStore((state) => state.addHistory);
  const clearHistory = useMediaStore((state) => state.clearHistory);
  const showToast = useMediaStore((state) => state.showToast);

  const trimmedUrl = url.trim();
  const isUrlValid = useMemo(() => !trimmedUrl || isValidUrl(trimmedUrl), [trimmedUrl]);
  const detectedPlatform = useMemo(() => (isValidUrl(trimmedUrl) ? detectPlatform(trimmedUrl) : 'Unknown'), [trimmedUrl]);
  const showInvalidState = inputTouched && Boolean(trimmedUrl) && !isUrlValid;

  const requestPreview = useCallback(
    async (targetUrl: string, notify = false) => {
      if (!isValidUrl(targetUrl)) {
        requestIdRef.current += 1;
        setIsPreviewLoading(false);
        setPreview(null);
        showToast({ type: 'error', message: 'Masukkan URL http/https yang valid.' });
        return;
      }

      if (lastAnalyzedUrl.current === targetUrl && preview?.url === targetUrl) {
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsPreviewLoading(true);
      try {
        const response = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl }),
        });
        const payload = (await response.json()) as { preview?: MediaPreview; error?: string };

        if (!response.ok || !payload.preview) {
          throw new Error(payload.error ?? 'Mock preview request failed.');
        }

        if (requestId !== requestIdRef.current) {
          return;
        }

        lastAnalyzedUrl.current = targetUrl;
        setPreview(payload.preview);

        if (notify) {
          showToast({
            type: payload.preview.platform === 'Unknown' ? 'info' : 'success',
            message: payload.preview.platform === 'Unknown' ? 'URL valid, tetapi platform belum didukung.' : `${payload.preview.platform} terdeteksi. Preview mock siap.`,
          });
        }
      } catch {
        if (requestId === requestIdRef.current) {
          showToast({ type: 'error', message: 'Gagal membuat preview mock. Coba lagi.' });
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsPreviewLoading(false);
        }
      }
    },
    [preview?.url, setPreview, showToast],
  );

  useEffect(() => {
    if (!trimmedUrl) {
      lastAnalyzedUrl.current = '';
      requestIdRef.current += 1;
      setIsPreviewLoading(false);
      setPreview(null);
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      lastAnalyzedUrl.current = '';
      requestIdRef.current += 1;
      setIsPreviewLoading(false);
      setPreview(null);
      return;
    }

    const timer = window.setTimeout(() => {
      void requestPreview(trimmedUrl, autoToastRef.current);
      autoToastRef.current = false;
    }, 550);

    return () => window.clearTimeout(timer);
  }, [requestPreview, setPreview, trimmedUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInputTouched(true);
    await requestPreview(trimmedUrl, true);
  }

  async function handleDownload(type: DownloadType) {
    if (!preview) {
      showToast({ type: 'error', message: 'Generate preview terlebih dahulu sebelum download.' });
      return;
    }

    if (!isValidUrl(preview.url)) {
      showToast({ type: 'error', message: 'URL preview tidak valid.' });
      return;
    }

    if (preview.platform === 'Unknown') {
      showToast({ type: 'error', message: 'Platform belum didukung untuk mock download.' });
      return;
    }

    setDownloadingType(type);
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: preview.url, type, title: preview.title }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Download mock gagal.');
      }

      const blob = await response.blob();
      const fallbackName = `glassfetch-${preview.platform.toLowerCase()}-${type}`;
      const filename = getFilenameFromDisposition(response.headers.get('Content-Disposition'), fallbackName);
      triggerBrowserDownload(blob, filename);
      addHistory(preview, type);
      showToast({ type: 'success', message: `Mock file ${type} berhasil diunduh.` });
    } catch (error) {
      showToast({ type: 'error', message: error instanceof Error ? error.message : 'Download mock gagal.' });
    } finally {
      setDownloadingType(null);
    }
  }

  return (
    <main id="hero" className="mx-auto w-full max-w-6xl px-3 pt-8 sm:px-4 sm:pt-12 lg:pt-14">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="min-w-0">
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-2 text-xs font-medium text-cyan-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-cyan-100 sm:px-4 sm:text-sm">
            <Sparkles className="size-4 shrink-0" />
            <span className="truncate">Premium glassmorphism media interface</span>
          </div>
          <h1 className="max-w-4xl text-balance text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-7xl">
            Preview downloader UI yang modern, cepat, dan compliance-first.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8 lg:text-lg">
            Paste URL TikTok, YouTube, atau Spotify untuk auto-detect platform, melihat preview mock, lalu mengunduh file placeholder legal tanpa scraping atau bypass DRM.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 rounded-[1.75rem] border border-slate-200/70 bg-white/75 p-2 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.08] sm:rounded-[2rem] sm:p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Media URL</span>
                <Link2 className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={url}
                  onBlur={() => setInputTouched(true)}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    setInputTouched(true);
                  }}
                  onPaste={() => {
                    setInputTouched(true);
                    autoToastRef.current = true;
                  }}
                  placeholder="Paste URL TikTok, YouTube, atau Spotify..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 pl-12 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/15 dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 sm:h-14 sm:rounded-3xl"
                />
              </label>
              <button
                type="submit"
                disabled={isPreviewLoading || !trimmedUrl}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 px-5 text-sm font-bold text-white shadow-glow transition hover:scale-[1.015] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-65 sm:h-14 sm:rounded-3xl sm:px-6"
              >
                {isPreviewLoading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
                {isPreviewLoading ? 'Analyzing' : 'Generate'}
              </button>
            </div>

            <InputFeedback showInvalid={showInvalidState} platform={detectedPlatform} hasUrl={Boolean(trimmedUrl)} isValid={isUrlValid} />
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            {['youtube.com', 'youtu.be', 'tiktok.com', 'vt.tiktok.com', 'spotify.com'].map((item) => (
              <span key={item} className="rounded-full border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <PreviewCard isLoading={isPreviewLoading} />
      </section>

      <section id="options" className="mt-10 grid gap-5 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
        <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/75 p-4 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.07] sm:rounded-[2rem] sm:p-6">
          <div className="flex items-center gap-3 text-slate-950 dark:text-white">
            <Download className="size-5 text-cyan-500" />
            <h2 className="text-xl font-bold sm:text-2xl">Download options</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Tombol ini memanggil `/api/download` dan mengunduh file mock legal. Tidak ada scraping, DRM bypass, atau ekstraksi konten platform.
          </p>

          <div className="mt-5 grid gap-3">
            {downloadOptions.map((option) => {
              const Icon = optionIcons[option.type];
              const isDownloading = downloadingType === option.type;
              const disabled = isPreviewLoading || isDownloading || !preview || preview.platform === 'Unknown';

              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => void handleDownload(option.type)}
                  disabled={disabled}
                  className="group flex min-h-20 items-center justify-between rounded-3xl border border-slate-200/70 bg-white/70 p-3 text-left transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-55 dark:border-white/10 dark:bg-slate-950/50 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-400/10 sm:p-4"
                >
                  <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-cyan-600 transition group-hover:scale-105 dark:bg-white/10 dark:text-cyan-200 sm:size-12">
                      {isDownloading ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-950 dark:text-white">{option.label}</span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{option.helper}</span>
                    </span>
                  </span>
                  <Download className="size-5 shrink-0 text-slate-400 transition group-hover:text-cyan-500" />
                </button>
              );
            })}
          </div>
        </div>

        <HistoryPanel history={mounted ? history : []} onClear={clearHistory} />
      </section>
    </main>
  );
}

function InputFeedback({ showInvalid, platform, hasUrl, isValid }: { showInvalid: boolean; platform: Platform; hasUrl: boolean; isValid: boolean }) {
  if (!hasUrl) {
    return null;
  }

  if (showInvalid) {
    return (
      <div className="mt-3 flex items-center gap-2 px-2 text-xs font-medium text-rose-600 dark:text-rose-300">
        <AlertCircle className="size-4" /> URL harus menggunakan format http:// atau https:// yang valid.
      </div>
    );
  }

  if (!isValid) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 px-2 text-xs font-medium text-slate-600 dark:text-slate-300">
      <CheckCircle2 className="size-4 text-emerald-500" />
      Auto-detected:
      <span className={`rounded-full border px-2.5 py-1 ${platformTone[platform]}`}>{getPlatformLabel(platform)}</span>
    </div>
  );
}

function HistoryPanel({ history, onClear }: { history: DownloadHistoryItem[]; onClear: () => void }) {
  return (
    <div id="history" className="rounded-[1.75rem] border border-slate-200/70 bg-white/75 p-4 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.07] sm:rounded-[2rem] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-slate-950 dark:text-white">
          <History className="size-5 text-violet-500" />
          <h2 className="text-xl font-bold sm:text-2xl">Local history</h2>
        </div>
        <button type="button" onClick={onClear} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15">
          <Trash2 className="size-4" /> Clear
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {history.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300/80 p-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400 sm:p-8">
            Belum ada history. Download file mock untuk menyimpan item ke localStorage.
          </div>
        ) : (
          history.map((item) => (
            <div key={`${item.id}-${item.selectedType}`} className="flex min-w-0 items-center gap-3 rounded-3xl bg-white/70 p-3 shadow-sm dark:bg-slate-950/45 sm:gap-4">
              <Image src={item.thumbnail} alt="" width={72} height={72} className="size-14 shrink-0 rounded-2xl object-cover sm:size-16" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-950 dark:text-white sm:text-base">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.platform} • {item.selectedType}</p>
              </div>
              <Clock3 className="size-4 shrink-0 text-slate-400" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PreviewCard({ isLoading }: { isLoading: boolean }) {
  const preview = useMediaStore((state) => state.preview);

  return (
    <motion.aside id="preview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative min-w-0">
      <div className={`absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br ${platformGlow[preview?.platform ?? 'Unknown']} blur-3xl sm:-inset-6`} />
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/75 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.08] sm:rounded-[2.2rem]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 sm:p-5">
              <div className="h-64 rounded-[1.5rem] bg-[linear-gradient(110deg,rgba(148,163,184,0.12),rgba(255,255,255,0.7),rgba(148,163,184,0.12))] bg-[length:700px_100%] animate-shimmer dark:bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))] sm:h-72" />
              <div className="mt-5 space-y-3">
                <div className="h-5 w-2/3 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-white/10" />
              </div>
            </motion.div>
          ) : preview ? (
            <motion.div key={preview.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
              <div className="relative h-64 sm:h-72">
                <Image src={preview.thumbnail} alt={preview.title} fill className="object-cover" sizes="(min-width: 1024px) 520px, 100vw" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className={`absolute left-4 top-4 rounded-full border px-3 py-2 text-xs font-semibold sm:left-5 sm:top-5 ${platformTone[preview.platform]}`}>
                  {getPlatformLabel(preview.platform)}
                </span>
                <span className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-2 text-xs text-white backdrop-blur sm:bottom-5 sm:right-5">{preview.duration}</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className={`mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r ${preview.accent}`} />
                <h2 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">{preview.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{preview.creator}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{preview.description}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-[360px] place-items-center p-6 text-center sm:min-h-[430px] sm:p-8">
              <div>
                <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-slate-100 text-cyan-600 dark:bg-white/10 dark:text-cyan-200 sm:size-20">
                  <RefreshCcw className="size-7 animate-spin [animation-duration:5s] sm:size-8" />
                </div>
                <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">Awaiting media URL</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Paste URL valid untuk auto-detect platform, preview mock, dan format download.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-3xl border border-amber-300/30 bg-amber-200/40 p-4 text-sm text-amber-900 backdrop-blur-xl dark:border-amber-200/15 dark:bg-amber-300/10 dark:text-amber-100">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
        <p>Mock-only: tidak ada bypass DRM, scraping, ekstraksi media sungguhan, atau pelanggaran proteksi platform.</p>
      </div>
    </motion.aside>
  );
}
