# GlassFetch — Modern Media Downloader Mock UI

GlassFetch adalah web app frontend modern berbasis **Next.js 15 + TypeScript + Tailwind CSS** untuk mendemonstrasikan alur preview media dan pilihan download secara aman. Aplikasi ini menggunakan **mock API/backend placeholder** dan **tidak** mengimplementasikan bypass DRM, login wall, paywall, atau proteksi platform apa pun.

## Highlights

- ✨ Premium glassmorphism + modern dark UI
- 📱 Mobile-first responsive layout untuk mobile dan desktop
- 🔎 Input URL dengan auto-detect platform: TikTok, YouTube, Spotify
- 🖼️ Card preview media berbasis mock data
- ⬇️ Download options UI: video, audio, thumbnail
- 🌀 Animated loading state dengan Framer Motion
- 🔔 Toast notification
- 🧠 Download history tersimpan di localStorage via Zustand persist
- 🧭 Responsive navbar + footer
- 🌙 Dark mode by default
- 🧱 Production-ready App Router structure
- 🧩 SEO metadata, not-found page, dan error boundary
- 🚀 Deploy-ready untuk Vercel

## Compliance Notice

Project ini dibuat untuk kebutuhan UI/UX dan prototyping frontend. Tombol download hanya menyimpan opsi mock ke localStorage. Jangan gunakan project ini untuk mengambil konten tanpa izin, melanggar hak cipta, atau melewati DRM/proteksi platform.

## Tech Stack

- [Next.js 15](https://nextjs.org/) App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## Project Structure

```txt
src/
  app/
    api/preview/route.ts # Mock backend placeholder endpoint
    globals.css        # Tailwind entry and global visual styles
    layout.tsx         # SEO metadata, viewport, root layout
    page.tsx           # Home composition
    error.tsx          # Client error boundary UI
    not-found.tsx      # 404 page
  components/
    footer.tsx
    media-dashboard.tsx
    navbar.tsx
    toast.tsx
  lib/
    platform.ts        # URL validation, platform detection, mock preview factory
  store/
    use-media-store.ts # Zustand store + localStorage persistence
  types/
    media.ts           # Shared TypeScript types
```

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

### Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repository in Vercel.
3. Set `NEXT_PUBLIC_APP_URL` to your deployed URL.
4. Use the default Vercel settings for Next.js.
5. Deploy.

No custom server is required.

## Mock Flow

1. User pastes a TikTok, YouTube, or Spotify URL.
2. The client posts to `/api/preview`, a mock backend placeholder endpoint.
3. `detectPlatform()` checks the hostname pattern.
4. `createMockPreview()` simulates a short backend delay.
5. The UI renders a preview card with mock metadata.
6. Selecting video/audio/thumbnail writes a local mock history item to localStorage.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```


## Future Backend Integration

If you add a real backend later, ensure it:

- Respects platform terms of service.
- Does not bypass DRM, authentication, paywalls, or technical protection measures.
- Validates user authorization and content rights.
- Provides transparent error states for unsupported URLs.
