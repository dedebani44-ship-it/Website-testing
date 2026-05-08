import { Footer } from '@/components/footer';
import { MediaDashboard } from '@/components/media-dashboard';
import { Navbar } from '@/components/navbar';
import { Toast } from '@/components/toast';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_38%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#ecfeff_100%)] transition-colors dark:bg-noise-gradient">
      <div className="glass-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 size-[24rem] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl animate-glow-pulse dark:bg-cyber/10 sm:size-[32rem]" />
      <div className="pointer-events-none absolute right-0 top-40 size-[20rem] rounded-full bg-violet-300/20 blur-3xl animate-float dark:bg-aurora/15 sm:size-[28rem]" />
      <Navbar />
      <MediaDashboard />
      <Footer />
      <Toast />
    </div>
  );
}
