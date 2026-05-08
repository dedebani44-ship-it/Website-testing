import { Github, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mx-auto mt-14 w-full max-w-6xl px-3 pb-8 sm:mt-20 sm:px-4 sm:pb-10">
      <div className="grid gap-6 rounded-3xl border border-slate-200/70 bg-white/70 p-5 text-sm text-slate-600 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 sm:p-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-semibold text-slate-950 dark:text-white">GlassFetch</p>
          <p className="mt-2 max-w-2xl leading-6">
            Frontend mock downloader UI for product demos. It intentionally does not bypass DRM, login walls, paywalls, or platform protections.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-white/10"><Shield className="size-4" /> Compliance-first</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-white/10"><Github className="size-4" /> Vercel-ready</span>
        </div>
      </div>
    </footer>
  );
}
