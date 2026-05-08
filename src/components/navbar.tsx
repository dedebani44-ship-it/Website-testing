'use client';

import { motion } from 'framer-motion';
import { DownloadCloud, Menu, Moon, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';

const navItems = ['Preview', 'Options', 'History'];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-6xl rounded-3xl border border-white/10 bg-white/10 px-4 py-3 shadow-glass backdrop-blur-2xl"
    >
      <nav className="flex items-center justify-between gap-4">
        <a href="#hero" className="flex items-center gap-3" aria-label="GlassFetch home">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-cyber to-aurora shadow-glow">
            <DownloadCloud className="size-5 text-white" />
          </span>
          <div>
            <p className="text-base font-bold tracking-tight text-white">GlassFetch</p>
            <p className="text-xs text-slate-400">Mock media UI</p>
          </div>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-200">
            <ShieldCheck className="size-4" /> DRM-safe mock
          </span>
          <button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/10 text-slate-200" aria-label="Dark mode enabled">
            <Moon className="size-4" />
          </button>
        </div>

        <button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/10 text-white md:hidden" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle navigation">
          <Menu className="size-5" />
        </button>
      </nav>

      {isOpen ? (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 grid gap-2 border-t border-white/10 pt-4 md:hidden">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200" onClick={() => setIsOpen(false)}>
              {item}
            </a>
          ))}
          <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            <Sparkles className="size-4" /> Modern dark UI enabled
          </span>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
