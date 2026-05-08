import { Github, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-6xl px-4 pb-10">
      <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-sm text-slate-300 backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-semibold text-white">GlassFetch</p>
          <p className="mt-2 max-w-2xl leading-6">
            Frontend mock downloader UI for product demos. It intentionally does not bypass DRM, login walls, paywalls, or platform protections.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><Shield className="size-4" /> Compliance-first</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><Github className="size-4" /> Vercel-ready</span>
        </div>
      </div>
    </footer>
  );
}
