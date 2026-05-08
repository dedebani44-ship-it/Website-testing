'use client';

import { motion } from 'framer-motion';
import { DownloadCloud, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = ['Preview', 'Options', 'History'];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-3 z-40 mx-auto w-[calc(100%-1rem)] max-w-6xl rounded-3xl border border-slate-200/70 bg-white/75 px-3 py-3 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45 sm:top-4 sm:w-[calc(100%-2rem)] sm:px-4"
    >
      <nav className="flex items-center justify-between gap-3">
        <a href="#hero" className="flex min-w-0 items-center gap-3" aria-label="GlassFetch home">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-glow sm:size-11">
            <DownloadCloud className="size-5 text-white" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight text-slate-950 dark:text-white">GlassFetch</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">Mock media UI</p>
          </div>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-200 md:inline-flex">
            <ShieldCheck className="size-4" /> DRM-safe mock
          </span>
          <ThemeToggle />
          <button type="button" className="grid size-10 place-items-center rounded-full border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-white md:hidden" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle navigation">
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {isOpen ? (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 grid gap-2 border-t border-slate-200/70 pt-4 dark:border-white/10 md:hidden">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200" onClick={() => setIsOpen(false)}>
              {item}
            </a>
          ))}
          <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
            <Sparkles className="size-4" /> Modern theme toggle enabled
          </span>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
