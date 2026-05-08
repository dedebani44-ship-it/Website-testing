import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://glassfetch.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'GlassFetch — Modern Media Downloader Mock UI',
    template: '%s | GlassFetch',
  },
  description: 'A production-ready mock media downloader frontend with platform detection UI, glassmorphism, dark mode, local history, and compliant placeholder API behavior.',
  keywords: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Glassmorphism', 'Media UI', 'Mock API'],
  authors: [{ name: 'GlassFetch' }],
  creator: 'GlassFetch',
  openGraph: {
    title: 'GlassFetch — Modern Media Downloader Mock UI',
    description: 'Premium dark glassmorphism UI for compliant mock media preview and download option flows.',
    url: appUrl,
    siteName: 'GlassFetch',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlassFetch — Modern Media Downloader Mock UI',
    description: 'Modern Next.js 15 frontend for platform detection, preview cards, mock options, and local history.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#070812',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} bg-noise-gradient font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
