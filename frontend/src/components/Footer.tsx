import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer style={{ background: '#08060A', borderTop: '1px solid rgba(194,137,30,0.12)' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '64px 40px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '48px', alignItems: 'start' }}>

          {/* Col 1 — Brand + Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={{ fontFamily: "'Syncopate', sans-serif", fontSize: '22px', fontWeight: 700, letterSpacing: '0.08em', color: '#F5EEE3', margin: 0 }}>
                MOON
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', 'Fraunces', Georgia, serif", fontSize: '13px', fontStyle: 'italic', color: '#C2891E', margin: '4px 0 0', letterSpacing: '0.02em' }}>
                Naturally Yours
              </p>
            </div>
            <p style={{ fontSize: '12px', lineHeight: '1.8', color: 'rgba(245,238,227,0.45)', margin: 0, maxWidth: 220 }}>
              Kanispora Baramulla<br />
              Jammu &amp; Kashmir, India — 193101
            </p>
            <a href="mailto:hello@moonnaturally.com" style={{ fontSize: '12px', color: 'rgba(194,137,30,0.7)', textDecoration: 'none', letterSpacing: '0.02em' }}>
              hello@moonnaturally.com
            </a>
          </div>

          {/* Col 2 — Shop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontFamily: "'Syncopate', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,238,227,0.35)', margin: 0 }}>
              Shop
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Shop All', to: '/products' },
                { label: 'Rituals', to: '/#rituals' },
                { label: 'Origins', to: '/#archives' },
                { label: 'Dry Fruits &amp; Nuts', to: '/products' },
                { label: 'Kashmiri Ghee', to: '/products' },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  dangerouslySetInnerHTML={{ __html: label }}
                  style={{ fontSize: '13px', color: 'rgba(245,238,227,0.55)', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5EEE3')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,238,227,0.55)')}
                />
              ))}
            </nav>
          </div>

          {/* Col 3 — Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontFamily: "'Syncopate', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,238,227,0.35)', margin: 0 }}>
              Company
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'About Us', to: '/#about' },
                { label: 'Journal', to: '/#about' },
                { label: 'Media', to: '/#about' },
                { label: 'FAQs', to: '/#about' },
                { label: 'Contact Us', to: '/#about' },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  style={{ fontSize: '13px', color: 'rgba(245,238,227,0.55)', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5EEE3')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,238,227,0.55)')}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4 — Follow Us */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontFamily: "'Syncopate', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,238,227,0.35)', margin: 0 }}>
              Follow Us
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a href="https://www.instagram.com/moonnaturallyyours/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(245,238,227,0.55)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5EEE3')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,238,227,0.55)')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
                </svg>
                Instagram
              </a>
              <a href="https://www.facebook.com/moonnaturallyyours" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(245,238,227,0.55)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5EEE3')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,238,227,0.55)')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                Facebook
              </a>
              <a href="https://www.youtube.com/@moonnaturallyyours" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(245,238,227,0.55)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5EEE3')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,238,227,0.55)')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
                </svg>
                YouTube
              </a>
              <a href="https://x.com/moonnaturallyyours" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(245,238,227,0.55)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5EEE3')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,238,227,0.55)')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
                X (Twitter)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: '48px', paddingTop: '20px', paddingBottom: '24px', borderTop: '1px solid rgba(245,238,227,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(245,238,227,0.28)', margin: 0, letterSpacing: '0.02em' }}>
            © 2026 MOON Naturally Yours. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms & Conditions', 'Shipping Policy'].map(label => (
              <Link
                key={label}
                to="/#about"
                style={{ fontSize: '11px', color: 'rgba(245,238,227,0.28)', textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,238,227,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,238,227,0.28)')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
