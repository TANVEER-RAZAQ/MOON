'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="moon-footer-new">
      <div className="moon-footer-new__inner">

        {/* Col 1 — Brand + Address */}
        <div className="moon-footer-new__col">
          <div>
            <p className="moon-footer-new__brand">MOON.</p>
            <p className="moon-footer-new__brand-tag t-display-italic">Naturally Yours</p>
          </div>
          <address className="moon-footer-new__addr">
            Kanispora, Baramulla<br />
            Jammu &amp; Kashmir, India — 193101<br />
            <a href="mailto:hello@moonnaturally.com">hello@moonnaturally.com</a>
          </address>
          <div className="moon-footer-new__social">
            <a href="https://www.instagram.com/moonnaturallyyours/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/moonnaturallyyours" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@moonnaturallyyours" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://x.com/moonnaturallyyours" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2 — Shop */}
        <div className="moon-footer-new__col">
          <span className="t-eyebrow">Shop</span>
          <ul>
            <li><Link href="/products">Shop All</Link></li>
            <li><Link href="/#rituals">Rituals</Link></li>
            <li><Link href="/#archive">Origins</Link></li>
            <li><Link href="/products">Dry Fruits &amp; Nuts</Link></li>
            <li><Link href="/products">Kashmiri Ghee</Link></li>
          </ul>
        </div>

        {/* Col 3 — Company */}
        <div className="moon-footer-new__col">
          <span className="t-eyebrow">Company</span>
          <ul>
            <li><Link href="/#about">About Us</Link></li>
            <li><Link href="/#journal">Journal</Link></li>
            <li><Link href="/#about">Media</Link></li>
            <li><Link href="/#about">FAQs</Link></li>
            <li><Link href="/#about">Contact Us</Link></li>
          </ul>
        </div>

        {/* Col 4 — Newsletter teaser */}
        <div className="moon-footer-new__col">
          <span className="t-eyebrow">Join the List</span>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(245,239,230,0.55)', margin: '0.5rem 0 0' }}>
            Harvest notes, small-batch drops, and the occasional recipe. One letter per season.
          </p>
          <Link
            href="/#journal"
            style={{
              marginTop: '1rem',
              display: 'inline-block',
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--moon-honey-500, #D4A24A)',
              borderBottom: '1px solid var(--moon-honey-500, #D4A24A)',
              paddingBottom: '2px',
              transition: 'opacity 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Subscribe →
          </Link>
        </div>
      </div>

      <div className="moon-footer-new__base">
        <span>© 2026 MOON Naturally Yours. All rights reserved.</span>
        <ul>
          {['Privacy Policy', 'Terms & Conditions', 'Shipping Policy'].map(label => (
            <li key={label}>
              <Link href="/#about" style={{ color: 'inherit', textDecoration: 'none' }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
