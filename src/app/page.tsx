import { Footer } from '@/components/footer';
import { MediaDashboard } from '@/components/media-dashboard';
import { Navbar } from '@/components/navbar';
import { Toast } from '@/components/toast';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="glass-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 size-[32rem] -translate-x-1/2 rounded-full bg-cyber/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 size-[28rem] rounded-full bg-aurora/15 blur-3xl" />
      <Navbar />
      <MediaDashboard />
      <Footer />
      <Toast />
    </div>
  );
}
