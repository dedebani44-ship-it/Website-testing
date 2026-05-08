'use client';

import { RotateCcw } from 'lucide-react';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-noise-gradient px-6 text-center text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-glass backdrop-blur-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-300">Error</p>
        <h1 className="mt-4 text-3xl font-black">Terjadi kesalahan</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">UI gagal dirender. Silakan coba muat ulang bagian ini.</p>
        <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyber to-aurora px-5 py-3 text-sm font-bold">
          <RotateCcw className="size-4" /> Coba lagi
        </button>
      </div>
    </main>
  );
}
