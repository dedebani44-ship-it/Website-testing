import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-noise-gradient px-6 text-center text-white">
      <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-glass backdrop-blur-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyber">404</p>
        <h1 className="mt-4 text-3xl font-black">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">Kembali ke dashboard untuk mencoba preview URL media mock.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-cyber to-aurora px-5 py-3 text-sm font-bold">
          Kembali ke Home
        </Link>
      </div>
    </main>
  );
}
