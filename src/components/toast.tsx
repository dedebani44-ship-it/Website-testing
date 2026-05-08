'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useMediaStore } from '@/store/use-media-store';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function Toast() {
  const toast = useMediaStore((state) => state.toast);
  const dismissToast = useMediaStore((state) => state.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 3200);
    return () => window.clearTimeout(timer);
  }, [dismissToast, toast]);

  const Icon = toast ? iconMap[toast.type] : Info;

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-3xl border border-slate-200/70 bg-white/90 p-4 text-slate-950 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/90 dark:text-white sm:bottom-5 sm:w-[calc(100%-2rem)]"
          role="status"
        >
          <Icon className="size-5 shrink-0 text-cyan-500" />
          <p className="flex-1 text-sm text-slate-700 dark:text-slate-100">{toast.message}</p>
          <button type="button" onClick={dismissToast} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Dismiss notification">
            <X className="size-4" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
