import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { AppShell } from '@/components/AppShell';
import { allFontVars } from '@moon/shared/fonts';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'MOON Naturally Yours | Kashmiri Saffron, Shilajit & Wellness Products India',
  description:
    'MOON Naturally Yours — premium Kashmiri saffron, Himalayan shilajit, raw mountain honey, almonds, walnuts and bilona ghee. Single-origin wellness delivered across India.',
  keywords:
    'Kashmiri saffron, Mongra saffron, buy saffron online India, Himalayan shilajit, raw Kashmiri honey, Kashmiri almonds, bilona ghee, wellness store India, prophetic wellness, MOON Naturally Yours',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'MOON Naturally Yours',
    title: 'MOON Naturally Yours | Premium Kashmiri Wellness Products',
    description:
      'Single-origin Kashmiri saffron, Himalayan shilajit, raw mountain honey and more — sourced with care, delivered across India.',
    images: [{ url: 'https://www.moonnaturallyyours.com/og/og-homepage.jpg', width: 1200, height: 630 }],
    url: 'https://www.moonnaturallyyours.com/',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@moonnaturallyyours',
    title: 'MOON Naturally Yours | Premium Kashmiri Wellness Products',
    description: 'Shop Kashmiri saffron, shilajit, and raw honey with a premium mobile-first experience. Ships across India.',
    images: ['https://www.moonnaturallyyours.com/og/og-homepage.jpg'],
  },
  alternates: {
    canonical: 'https://www.moonnaturallyyours.com/',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MOON Naturally Yours',
    url: 'https://www.moonnaturallyyours.com',
    logo: 'https://www.moonnaturallyyours.com/og/og-homepage.jpg',
    description: 'Premium single-origin Kashmiri wellness products — saffron, shilajit, honey, dry fruits and ghee, sourced directly and delivered across India.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@moonnaturallyyours.com',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.instagram.com/moonnaturallyyours/',
      'https://x.com/moonnaturallyyours',
      'https://www.youtube.com/@moonnaturallyyours',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MOON Naturally Yours',
    url: 'https://www.moonnaturallyyours.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.moonnaturallyyours.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={allFontVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300,0,-25&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
