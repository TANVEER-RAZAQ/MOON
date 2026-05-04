import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { allFontVars } from '@moon/shared/fonts';
import { proxyGuard } from '@/proxy';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'MOON Admin',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await proxyGuard();
  return (
    <html lang="en" className={allFontVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300,0,-25&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
