import type { Metadata, Viewport } from 'next';
import './globals.css';
import { OfflineChip } from '@/components/OfflineChip';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'कला-संगम | KALA-SANGAM - Voice-First Artisan Marketplace',
  description: 'AI-Driven Multilingual Market Linkage and Smart Cataloging for Marginalized Indian Artisans',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KALA-SANGAM',
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#9D3E1B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FFF8F6] text-[#221A16] overflow-x-hidden selection:bg-[#9D3E1B]/20 font-sans">
        <Providers>
          {children}
          <OfflineChip />
        </Providers>
      </body>
    </html>
  );
}
