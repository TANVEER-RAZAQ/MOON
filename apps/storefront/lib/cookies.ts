export interface CookieConsent {
  essential: true;       // always on
  analytics: boolean;
  marketing: boolean;
  decided: boolean;      // true once user has interacted
}

const KEY = 'moon_cookie_consent';

export function getConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(consent));
  // Dispatch a custom event so GoogleAnalytics component can react
  window.dispatchEvent(new CustomEvent('moon:consent', { detail: consent }));
}

export const DEFAULTS: CookieConsent = { essential: true, analytics: false, marketing: false, decided: false };
