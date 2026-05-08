'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMounted } from '@/hooks/use-mounted';

export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group grid size-10 place-items-center rounded-full border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-xl transition hover:scale-105 hover:border-cyan-300 hover:text-cyan-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:text-cyan-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      suppressHydrationWarning
    >
      {!mounted ? <span className="size-4" /> : isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
