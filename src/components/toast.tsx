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
          className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/85 p-4 text-white shadow-glass backdrop-blur-2xl"
          role="status"
        >
          <Icon className="size-5 text-cyber" />
          <p className="flex-1 text-sm text-slate-100">{toast.message}</p>
          <button onClick={dismissToast} className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Dismiss notification">
            <X className="size-4" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
