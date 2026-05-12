'use client';
import { useEffect, useState } from 'react';
import { getConsent, saveConsent, DEFAULTS } from '@/lib/cookies';
import type { CookieConsent } from '@/lib/cookies';

export function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULTS);
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Local toggle state for the settings panel
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [marketingOn, setMarketingOn] = useState(false);

  useEffect(() => {
    const stored = getConsent();
    if (stored) {
      setConsent(stored);
      setAnalyticsOn(stored.analytics);
      setMarketingOn(stored.marketing);
      if (!stored.decided) {
        setShow(true);
      }
    } else {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleAcceptAll = () => {
    const updated: CookieConsent = { essential: true, analytics: true, marketing: true, decided: true };
    saveConsent(updated);
    setConsent(updated);
    setShow(false);
  };

  const handleEssentialsOnly = () => {
    const updated: CookieConsent = { essential: true, analytics: false, marketing: false, decided: true };
    saveConsent(updated);
    setConsent(updated);
    setShow(false);
  };

  const handleOpenSettings = () => {
    setAnalyticsOn(consent.analytics);
    setMarketingOn(consent.marketing);
    setShowSettings(true);
  };

  const handleSavePreferences = () => {
    const updated: CookieConsent = { essential: true, analytics: analyticsOn, marketing: marketingOn, decided: true };
    saveConsent(updated);
    setConsent(updated);
    setShow(false);
    setShowSettings(false);
  };

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    width: 40,
    height: 22,
    borderRadius: 999,
    backgroundColor: active ? '#C58A1E' : 'rgba(245,239,230,0.2)',
    border: 'none',
    cursor: 'pointer',
    padding: '0 3px',
    transition: 'background-color 0.2s ease',
    flexShrink: 0,
  });

  const thumbStyle = (active: boolean): React.CSSProperties => ({
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: '#FAF6EF',
    transform: active ? 'translateX(18px)' : 'translateX(0)',
    transition: 'transform 0.2s ease',
  });

  const disabledToggleStyle: React.CSSProperties = {
    ...toggleStyle(true),
    backgroundColor: 'rgba(245,239,230,0.2)',
    cursor: 'not-allowed',
    opacity: 0.5,
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        backgroundColor: '#0F0C09',
        borderTop: '1px solid rgba(245,239,230,0.1)',
      }}
    >
      {/* Settings panel — shown above the main banner row */}
      {showSettings && (
        <div
          style={{
            backgroundColor: '#1A140F',
            padding: 'clamp(16px, 3vw, 32px) clamp(16px, 4vw, 48px)',
            borderBottom: '1px solid rgba(245,239,230,0.08)',
          }}
        >
          <p
            style={{
              fontFamily: 'Fraunces, serif',
              fontSize: 18,
              color: '#FAF6EF',
              margin: '0 0 20px 0',
              fontWeight: 400,
            }}
          >
            Cookie Preferences
          </p>

          {/* Essential Cookies row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#FAF6EF', margin: '0 0 4px 0', fontWeight: 600 }}>
                Essential Cookies
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: 'rgba(245,239,230,0.6)', margin: 0 }}>
                Required for the cart, checkout, and basic site functionality. Cannot be disabled.
              </p>
            </div>
            <button style={disabledToggleStyle} disabled aria-label="Essential cookies always enabled">
              <span style={thumbStyle(true)} />
            </button>
          </div>

          {/* Analytics Cookies row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#FAF6EF', margin: '0 0 4px 0', fontWeight: 600 }}>
                Analytics Cookies
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: 'rgba(245,239,230,0.6)', margin: 0 }}>
                Help us understand which pages are most visited and where visitors come from. Data is anonymised via Google Analytics.
              </p>
            </div>
            <button
              style={toggleStyle(analyticsOn)}
              onClick={() => setAnalyticsOn((v) => !v)}
              aria-label={analyticsOn ? 'Disable analytics cookies' : 'Enable analytics cookies'}
              aria-pressed={analyticsOn}
            >
              <span style={thumbStyle(analyticsOn)} />
            </button>
          </div>

          {/* Marketing Cookies row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#FAF6EF', margin: '0 0 4px 0', fontWeight: 600 }}>
                Marketing Cookies
              </p>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: 'rgba(245,239,230,0.6)', margin: 0 }}>
                Allow us to show relevant ads on other platforms and measure campaign performance.
              </p>
            </div>
            <button
              style={toggleStyle(marketingOn)}
              onClick={() => setMarketingOn((v) => !v)}
              aria-label={marketingOn ? 'Disable marketing cookies' : 'Enable marketing cookies'}
              aria-pressed={marketingOn}
            >
              <span style={thumbStyle(marketingOn)} />
            </button>
          </div>

          <button
            onClick={handleSavePreferences}
            style={{
              backgroundColor: '#C58A1E',
              color: '#0B0806',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 700,
              padding: '10px 20px',
              borderRadius: 2,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            Save Preferences
          </button>
        </div>
      )}

      {/* Main banner row */}
      <div
        style={{
          padding: '20px clamp(16px, 4vw, 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {/* Left: description */}
        <p
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 13,
            color: 'rgba(245,239,230,0.75)',
            margin: 0,
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          We use cookies to improve your experience and understand how MOON is used. Analytics cookies help us see which pages perform best. You can choose what to allow.{' '}
          <a
            href="/privacy-policy"
            style={{
              color: '#C58A1E',
              textDecoration: 'underline',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 13,
            }}
          >
            Learn more
          </a>
        </p>

        {/* Right: action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={handleAcceptAll}
            style={{
              backgroundColor: '#C58A1E',
              color: '#0B0806',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 700,
              padding: '10px 20px',
              borderRadius: 2,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            Accept All
          </button>

          <button
            onClick={handleEssentialsOnly}
            style={{
              backgroundColor: 'transparent',
              color: '#FAF6EF',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: 2,
              border: '1px solid rgba(245,239,230,0.3)',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            Essentials Only
          </button>

          <button
            onClick={handleOpenSettings}
            style={{
              backgroundColor: 'transparent',
              color: 'rgba(245,239,230,0.6)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 500,
              padding: '10px 8px',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}
