'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getConsent } from '@/lib/cookies';
import type { CookieConsent } from '@/lib/cookies';

const GA_ID = 'G-KZ7WEHF3DE';

export function GoogleAnalytics() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(getConsent());

    const handleConsent = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsent>).detail;
      setConsent(detail);

      // When analytics consent is revoked, inform gtag
      if (!detail.analytics && typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('consent', 'update', { analytics_storage: 'denied' });
      }
    };

    window.addEventListener('moon:consent', handleConsent);
    return () => window.removeEventListener('moon:consent', handleConsent);
  }, []);

  if (!consent?.analytics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
      `}</Script>
    </>
  );
}
