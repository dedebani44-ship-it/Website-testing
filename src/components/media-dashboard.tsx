'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Clock3, Download, FileAudio, FileVideo, History, Image as ImageIcon, Link2, Loader2, RefreshCcw, Search, ShieldAlert, Sparkles, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { downloadOptions, isValidUrl } from '@/lib/platform';
import { useMediaStore } from '@/store/use-media-store';
import type { DownloadType, MediaPreview, Platform } from '@/types/media';

const platformTone: Record<Platform, string> = {
  TikTok: 'text-cyan-200 bg-cyan-300/10 border-cyan-200/20',
  YouTube: 'text-rose-200 bg-rose-400/10 border-rose-200/20',
  Spotify: 'text-emerald-200 bg-emerald-400/10 border-emerald-200/20',
  Unknown: 'text-slate-200 bg-slate-400/10 border-slate-200/20',
};

const optionIcons: Record<DownloadType, typeof FileVideo> = {
  video: FileVideo,
  audio: FileAudio,
  thumbnail: ImageIcon,
};

export function MediaDashboard() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const preview = useMediaStore((state) => state.preview);
  const history = useMediaStore((state) => state.history);
  const setPreview = useMediaStore((state) => state.setPreview);
  const addHistory = useMediaStore((state) => state.addHistory);
  const clearHistory = useMediaStore((state) => state.clearHistory);
  const showToast = useMediaStore((state) => state.showToast);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
      showToast({ type: 'error', message: 'Masukkan URL http/https yang valid.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const payload = (await response.json()) as { preview?: MediaPreview; error?: string };

      if (!response.ok || !payload.preview) {
        throw new Error(payload.error ?? 'Mock preview request failed.');
      }

      const mediaPreview = payload.preview;
      setPreview(mediaPreview);
      showToast({
        type: mediaPreview.platform === 'Unknown' ? 'info' : 'success',
        message: mediaPreview.platform === 'Unknown' ? 'Platform belum didukung.' : `${mediaPreview.platform} terdeteksi. Preview mock siap.`,
      });
    } catch {
      showToast({ type: 'error', message: 'Gagal membuat preview mock. Coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  }

  function handleDownload(type: DownloadType) {
    if (!preview || preview.platform === 'Unknown') {
      showToast({ type: 'error', message: 'Preview valid diperlukan sebelum memilih opsi.' });
      return;
    }

    addHistory(preview, type);
    showToast({ type: 'success', message: `Opsi ${type} ditambahkan ke history lokal (mock).` });
  }

  return (
    <main id="hero" className="mx-auto w-full max-w-6xl px-4 pt-14">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur-xl">
            <Sparkles className="size-4" /> Premium glassmorphism media interface
          </div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Preview downloader UI yang modern, cepat, dan compliance-first.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Deteksi URL TikTok, YouTube, dan Spotify secara otomatis dengan mock backend placeholder. Fokus pada pengalaman frontend tanpa bypass DRM atau proteksi platform.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.08] p-3 shadow-glass backdrop-blur-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Media URL</span>
                <Link2 className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="Paste URL TikTok, YouTube, atau Spotify..."
                  className="h-14 w-full rounded-3xl border border-white/10 bg-slate-950/70 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyber/60 focus:ring-4 focus:ring-cyber/10"
                />
              </label>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-cyber to-aurora px-6 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
                {isLoading ? 'Analyzing' : 'Generate Preview'}
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-400">
            {['TikTok', 'YouTube', 'Spotify', 'Mock API', 'LocalStorage'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">{item}</span>
            ))}
          </div>
        </motion.div>

        <PreviewCard isLoading={isLoading} />
      </section>

      <section id="options" className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-glass backdrop-blur-2xl">
          <div className="flex items-center gap-3 text-white">
            <Download className="size-5 text-cyber" />
            <h2 className="text-2xl font-bold">Download options UI</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Tombol di bawah adalah placeholder UI. Integrasikan hanya dengan backend yang mematuhi ketentuan layanan dan hak cipta platform.
          </p>

          <div className="mt-6 grid gap-3">
            {downloadOptions.map((option) => {
              const Icon = optionIcons[option.type];
              return (
                <button
                  key={option.type}
                  onClick={() => handleDownload(option.type)}
                  className="group flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-left transition hover:border-cyber/40 hover:bg-cyber/10"
                >
                  <span className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-cyber transition group-hover:scale-110">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{option.label}</span>
                      <span className="text-sm text-slate-400">{option.helper}</span>
                    </span>
                  </span>
                  <Download className="size-5 text-slate-500 group-hover:text-cyber" />
                </button>
              );
            })}
          </div>
        </div>

        <div id="history" className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-glass backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-white">
              <History className="size-5 text-aurora" />
              <h2 className="text-2xl font-bold">Local history</h2>
            </div>
            <button onClick={clearHistory} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/15">
              <Trash2 className="size-4" /> Clear
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            {history.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">
                Belum ada history. Pilih opsi mock download untuk menyimpan ke localStorage.
              </div>
            ) : (
              history.map((item) => (
                <div key={`${item.id}-${item.selectedType}`} className="flex items-center gap-4 rounded-3xl bg-slate-950/45 p-3">
                  <Image src={item.thumbnail} alt="" width={72} height={72} className="size-16 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.platform} • {item.selectedType}</p>
                  </div>
                  <Clock3 className="size-4 text-slate-500" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function PreviewCard({ isLoading }: { isLoading: boolean }) {
  const preview = useMediaStore((state) => state.preview);

  return (
    <motion.aside id="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-cyber/20 via-aurora/20 to-pink-500/20 blur-3xl" />
      <div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.08] shadow-glass backdrop-blur-2xl">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
              <div className="h-72 rounded-[1.7rem] bg-[linear-gradient(110deg,rgba(255,255,255,0.06),rgba(255,255,255,0.16),rgba(255,255,255,0.06))] bg-[length:700px_100%] animate-shimmer" />
              <div className="mt-5 space-y-3">
                <div className="h-5 w-2/3 rounded-full bg-white/10" />
                <div className="h-4 w-1/2 rounded-full bg-white/10" />
              </div>
            </motion.div>
          ) : preview ? (
            <motion.div key={preview.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
              <div className="relative h-72">
                <Image src={preview.thumbnail} alt={preview.title} fill className="object-cover" sizes="(min-width: 1024px) 520px, 100vw" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className={`absolute left-5 top-5 rounded-full border px-3 py-2 text-xs font-semibold ${platformTone[preview.platform]}`}>
                  {preview.platform}
                </span>
                <span className="absolute bottom-5 right-5 rounded-full bg-black/50 px-3 py-2 text-xs text-white backdrop-blur">{preview.duration}</span>
              </div>
              <div className="p-6">
                <div className={`mb-4 h-1.5 w-24 rounded-full bg-gradient-to-r ${preview.accent}`} />
                <h2 className="text-2xl font-bold text-white">{preview.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{preview.creator}</p>
                <p className="mt-4 text-sm leading-6 text-slate-400">{preview.description}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-[430px] place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-white/10 text-cyber">
                  <RefreshCcw className="size-8 animate-spin [animation-duration:5s]" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white">Awaiting media URL</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">Paste URL untuk melihat preview mock, platform badge, dan opsi download UI.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-3xl border border-amber-200/15 bg-amber-300/10 p-4 text-sm text-amber-100 backdrop-blur-xl">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
        <p>Mock-only: tidak ada bypass DRM, ekstraksi media sungguhan, atau pelanggaran proteksi platform.</p>
      </div>
    </motion.aside>
  );
}
