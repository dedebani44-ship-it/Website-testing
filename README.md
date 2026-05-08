# GlassFetch — Modern Media Downloader Mock UI

GlassFetch adalah web app frontend modern berbasis **Next.js 15 + TypeScript + Tailwind CSS** untuk mendemonstrasikan alur preview media dan pilihan download secara aman. Aplikasi ini menggunakan **mock API/backend placeholder** dan **tidak** mengimplementasikan bypass DRM, scraping, login wall, paywall, atau proteksi platform apa pun.

## Highlights

- ✨ Premium glassmorphism dengan dark/light mode yang tersimpan di localStorage via `next-themes`
- 📱 Mobile-first responsive layout yang nyaman untuk Android Chrome dan desktop
- 🔎 Input URL dengan auto-detect platform: TikTok, YouTube, Spotify, dan fallback `Unknown`
- 🖼️ Card preview media berbasis mock data dan skeleton loading
- ⬇️ Download options UI: video, audio, thumbnail
- ✅ Tombol download benar-benar memanggil `/api/download` dan mengunduh file mock legal
- 🌀 Smooth animation dengan Framer Motion, animated glow, dan shimmer skeleton
- 🔔 Toast notification untuk success, error, dan info state
- 🧠 Download history tersimpan di localStorage via Zustand persist
- 🧭 Responsive navbar + footer
- 🧱 Production-ready App Router structure
- 🧩 SEO metadata, not-found page, dan error boundary
- 🚀 Deploy-ready untuk Vercel

## Compliance Notice

Project ini dibuat untuk kebutuhan UI/UX dan prototyping frontend. Endpoint download hanya menghasilkan file placeholder mock. Jangan gunakan project ini untuk mengambil konten tanpa izin, melanggar hak cipta, atau melewati DRM/proteksi platform.

## Tech Stack

- [Next.js 15](https://nextjs.org/) App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Lucide React](https://lucide.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## Project Structure

```txt
src/
  app/
    api/
      download/route.ts # Mock downloadable file endpoint
      preview/route.ts  # Mock preview endpoint
    globals.css         # Tailwind entry and global visual styles
    layout.tsx          # SEO metadata, theme provider, root layout
    page.tsx            # Home composition
    error.tsx           # Client error boundary UI
    not-found.tsx       # 404 page
  components/
    footer.tsx
    media-dashboard.tsx # Main downloader flow UI
    navbar.tsx
    theme-provider.tsx
    theme-toggle.tsx
    toast.tsx
  hooks/
    use-mounted.ts      # Hydration-safe mounted state helper
  lib/
    download-file.ts    # Browser blob download helpers
    platform.ts         # URL validation, platform detection, mock preview factory
  store/
    use-media-store.ts  # Zustand store + localStorage persistence
  types/
    media.ts            # Shared TypeScript types
```

## Supported URL Detection

Detector membaca hostname URL agar lebih akurat dan menghindari false-positive dari path/query string.

Contoh yang didukung:

- `https://youtube.com/watch?v=...`
- `https://www.youtube.com/shorts/...`
- `https://youtu.be/...`
- `https://tiktok.com/@user/video/...`
- `https://www.tiktok.com/@user/video/...`
- `https://vt.tiktok.com/...`
- `https://spotify.com/...`
- `https://open.spotify.com/track/...`

URL valid dengan platform lain akan mendapat fallback `Unknown` dan tombol download dinonaktifkan.

## Mock Download Flow

1. User paste URL.
2. Client memvalidasi URL dan auto-detect platform.
3. Client memanggil `/api/preview` untuk mendapatkan metadata mock.
4. UI menampilkan skeleton loading, preview card, dan opsi format download.
5. User memilih `video`, `audio`, atau `thumbnail`.
6. Client memanggil `/api/download`.
7. API mengembalikan file mock legal dengan header `Content-Disposition`.
8. Browser mengunduh blob file dan history tersimpan di localStorage.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Environment

Copy the environment example:

```bash
cp .env.example .env.local
```

Available variables:

```env
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
MOCK_API_MODE=true
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

### Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Push repository ke GitHub/GitLab/Bitbucket.
2. Import repository di Vercel.
3. Pastikan framework preset adalah **Next.js**.
4. Set environment variable `NEXT_PUBLIC_APP_URL` ke URL production Vercel.
5. Deploy dengan default Vercel build command: `npm run build`.

No custom server is required.

## Future Backend Integration

Jika nanti menambahkan backend sungguhan, pastikan backend tersebut:

- Mematuhi terms of service platform.
- Tidak bypass DRM, authentication, paywalls, atau technical protection measures.
- Memvalidasi hak pengguna terhadap konten.
- Menyediakan transparent error state untuk URL yang tidak didukung.
- Menyimpan audit/log sesuai kebutuhan compliance.
