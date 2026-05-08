import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center text-slate-950 dark:bg-noise-gradient dark:text-white">
      <div className="max-w-md rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyber">404</p>
        <h1 className="mt-4 text-3xl font-black">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Kembali ke dashboard untuk mencoba preview URL media mock.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-bold text-white">
          Kembali ke Home
        </Link>
      </div>
    </main>
  );
}
