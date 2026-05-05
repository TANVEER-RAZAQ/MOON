'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import '@/styles/Navbar.css';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearchClick: () => void;
  heroTheme?: 'light' | 'dark';
}

const NAV_SECTIONS = [
  { href: '/#shop',     label: 'Shop' },
  { href: '/#rituals',  label: 'Rituals' },
  { href: '/#archives', label: 'The Archive' },
  { href: '/#journal',  label: 'Journal' },
  { href: '/#contact',  label: 'Contact' },
];

export function Navbar({ cartCount, onCartClick, onSearchClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Close dropdown on scroll
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrolled]);

  return (
    <nav
      id="navbar"
      aria-label="Primary"
      className={`moon-nav${scrolled ? ' moon-nav--scrolled' : ''}`}
    >
      <div className="moon-nav-inner">
        {/* Brand — leftmost */}
        <Link href="/" aria-label="Moon home" className="moon-wordmark">
          <span className="moon-wordmark-text">MOON.</span>
          <span className="moon-wordmark-tagline">Naturally yours</span>
        </Link>

        {/* Nav links — right of brand, desktop only */}
        <ul className="moon-nav-links">
          {NAV_SECTIONS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="moon-nav-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions — far right */}
        <div className="moon-nav-actions">
          <button type="button" aria-label="Search" onClick={onSearchClick} className="moon-nav-action-btn">
            <span className="material-symbols-outlined moon-nav-icon">search</span>
          </button>
          <button type="button" aria-label={`Cart, ${cartCount} items`} onClick={onCartClick} className="moon-nav-action-btn moon-nav-cart-btn">
            <span className="material-symbols-outlined moon-nav-icon">shopping_bag</span>
            {cartCount > 0 && <span className="moon-cart-badge">{cartCount}</span>}
          </button>

          {/* Hamburger — only visible when scrolled, opens section navigator */}
          <div ref={menuRef} className="moon-nav-menu-wrap">
            <button
              type="button"
              aria-label={menuOpen ? 'Close navigation' : 'Open section navigation'}
              aria-expanded={menuOpen ? "true" : "false"}
              aria-haspopup="true"
              onClick={() => setMenuOpen(o => !o)}
              className="moon-nav-action-btn moon-nav-hamburger"
            >
              <span className="material-symbols-outlined moon-nav-icon">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Section nav dropdown */}
            {menuOpen && (
              <nav className="moon-nav-dropdown" aria-label="Section navigation">
                {NAV_SECTIONS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
