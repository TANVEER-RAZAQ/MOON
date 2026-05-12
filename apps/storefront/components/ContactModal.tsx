'use client';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(11, 8, 6, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1A140F',
          border: '1px solid rgba(245,239,230,0.12)',
          borderRadius: '12px',
          padding: '2.5rem 2rem',
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(245,239,230,0.5)',
            fontSize: '1.5rem',
            lineHeight: 1,
            padding: '0.25rem 0.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#F5EFE6')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,239,230,0.5)')}
        >
          ×
        </button>

        {/* Header */}
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#F5EFE6',
            margin: '0 0 0.375rem',
            letterSpacing: '-0.01em',
          }}
        >
          Get in Touch
        </h2>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.875rem',
            color: 'rgba(245,239,230,0.55)',
            margin: '0 0 2rem',
            lineHeight: 1.6,
          }}
        >
          We'd love to hear from you.
        </p>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'rgba(245,239,230,0.08)',
            marginBottom: '1.75rem',
          }}
        />

        {/* Contact options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Phone / SMS */}
          <div>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(245,239,230,0.4)',
                margin: '0 0 0.5rem',
                fontWeight: 600,
              }}
            >
              Phone &amp; SMS
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Phone icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C58A1E"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.91-1.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <a
                  href="tel:+916005099213"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#C58A1E',
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  +91-6005099213
                </a>
                <a
                  href="sms:+916005099213"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.75rem',
                    color: 'rgba(197,138,30,0.7)',
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Send SMS
                </a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <p
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(245,239,230,0.4)',
                margin: '0 0 0.5rem',
                fontWeight: 600,
              }}
            >
              Email
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Envelope icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C58A1E"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
              </svg>
              <a
                href="mailto:admin@moonnaturallyyours.com"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#C58A1E',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  transition: 'opacity 0.2s',
                  wordBreak: 'break-all',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                admin@moonnaturallyyours.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
