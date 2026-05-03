'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HeroProductMedia } from '@/components/HeroProductMedia';
import { productStories } from '@/lib/data/products';
import type { CatalogItem, ProductKey } from '@/lib/types';
import '@/styles/HomePage.css';

type SlidePos = { productKey: ProductKey; isDetails: boolean };
const SLIDE_CONFIG: SlidePos[] = [
  { productKey: 'shilajit', isDetails: false },
  { productKey: 'kashmiriSaffron', isDetails: false },
  { productKey: 'kashmiriHoney', isDetails: false },
];
const TOTAL_SLIDES = SLIDE_CONFIG.length; // 3

interface CarouselTheme {
  primary: string;
  accent: string;
  glow: string;
}

const THEMES: Record<ProductKey, CarouselTheme> = {
  shilajit: { primary: '#2C1810', accent: '#7C4A2A', glow: '44,24,16' },
  kashmiriSaffron: { primary: '#C44A0C', accent: '#E8730A', glow: '196,74,12' },
  kashmiriHoney: { primary: '#8B6000', accent: '#C8960A', glow: '139,96,0' },
  iraniSaffron: { primary: '#D8A03F', accent: '#C8901F', glow: '216,160,63' },
  kashmiriAlmonds: { primary: '#CBA674', accent: '#A87854', glow: '203,166,116' },
  walnuts: { primary: '#9E7A52', accent: '#7E5A32', glow: '158,122,82' },
  kashmiriGhee: { primary: '#F1B65A', accent: '#E8A040', glow: '241,182,90' },
};

/* v2 — Themed card image backgrounds & accent colors per product */
const CARD_THEMES: Record<string, { imgBg: string; accentColor: string; starColor: string; btnBg: string }> = {
  shilajit: { imgBg: 'linear-gradient(145deg,#0F0603,#2C1810)', accentColor: '#7C4A2A', starColor: '#9E6A42', btnBg: '#2C1810' },
  kashmiriSaffron: { imgBg: 'linear-gradient(145deg,#1A0200,#3D1200)', accentColor: '#E8730A', starColor: '#E8730A', btnBg: '#B63E0F' },
  kashmiriHoney: { imgBg: 'linear-gradient(145deg,#160900,#2B1800)', accentColor: '#C8960A', starColor: '#C8960A', btnBg: '#8B6000' },
  iraniSaffron: { imgBg: 'linear-gradient(145deg,#1A1000,#3A2600)', accentColor: '#C8901F', starColor: '#C8901F', btnBg: '#8B6000' },
  kashmiriAlmonds: { imgBg: 'linear-gradient(145deg,#120C07,#2A1C0E)', accentColor: '#CBA674', starColor: '#CBA674', btnBg: '#5A3921' },
  walnuts: { imgBg: 'linear-gradient(145deg,#0D0803,#1E120A)', accentColor: '#9E7A52', starColor: '#9E7A52', btnBg: '#3A2810' },
  kashmiriGhee: { imgBg: 'linear-gradient(145deg,#150F00,#2E2400)', accentColor: '#E8A040', starColor: '#E8A040', btnBg: '#6B4800' },
};
const DEFAULT_CARD = { imgBg: 'var(--paper-1)', accentColor: 'var(--saffron-500)', starColor: 'var(--saffron-500)', btnBg: 'var(--ink-0)' };

const EDITORIAL_SLIDES = [
  {
    image: '/moon333/ezgif-frame-162.png',
    title: 'Shilajit',
    tagline: 'Mountain Strength',
    desc: 'Purified Himalayan resin — gold grade, third-party tested.',
    accent: '#2C1810',
    light: '#7C4A2A',
  },
  {
    image: '/moon2222/ezgif-frame-162.png',
    title: 'Kashmiri Saffron',
    tagline: 'Crimson Ritual',
    desc: 'Mongra A++ threads from Pampore, hand-sorted and sun-dried.',
    accent: '#C44A0C',
    light: '#E8730A',
  },
  {
    image: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
    title: 'Kashmiri Honey',
    tagline: 'Liquid Gold',
    desc: 'Raw wild honey from high-altitude Kashmir meadows.',
    accent: '#8B6000',
    light: '#C8960A',
  },
];

const SLIDESHOW_MS = 3200;

const STATS = [
  { value: '1,200+', label: 'Orders Delivered' },
  { value: '8,000+', label: 'Customers across India' },
  { value: '100%', label: 'Origin-Verified' },
  { value: '4.9 ★', label: 'Average Rating' },
];

const TESTIMONIALS = [
  { name: 'Aryan S.', role: 'Fitness Enthusiast', quote: 'MOON Shilajit transformed my recovery. Genuine quality, no shortcuts — this is the real deal.', rating: 5 },
  { name: 'Priya K.', role: 'Home Chef', quote: 'The Kashmiri Saffron aroma is truly unmatched. Rich red stigmas, incredible colour. I use it in everything now.', rating: 5 },
  { name: 'Rahul M.', role: 'Wellness Coach', quote: 'Been recommending MOON to every client. Pure, potent, and ethically sourced — exactly what wellness should be.', rating: 5 },
];

const CATEGORIES = [
  { label: 'All Products' },
  { label: 'Resin & Mineral' },
  { label: 'Kashmiri Saffron' },
  { label: 'Irani Saffron' },
  { label: 'Dry Fruits' },
  { label: 'Ghee' },
];

interface HomePageProps {
  catalogItems: CatalogItem[];
  onSelectProduct: (key: ProductKey) => void;
  onAddDetailToCart: () => void;
  onAddCatalogToCart: (item: { id: string; title: string; price: number }) => void;
  onBrowseCollection: () => void;
  onProductClick: (item: CatalogItem) => void;
}

export function HomePage({
  catalogItems,
  onSelectProduct,
  onAddDetailToCart,
  onAddCatalogToCart,
  onBrowseCollection,
  onProductClick,
}: HomePageProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [editorialSlide, setEditorialSlide] = useState(0);
  const [editorialFading, setEditorialFading] = useState(false);
  // 0 = video | 2 = full details (desktop only)
  const [heroPhase, setHeroPhase] = useState<0 | 1 | 2>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const touchStartX = useRef<number>(0);
  const advanceRef = useRef<() => void>(() => { });

  const activeKey = SLIDE_CONFIG[slideIndex].productKey;
  const theme = THEMES[activeKey];
  const activeStory = productStories[activeKey];

  const catalogByKey = useMemo(() =>
    catalogItems.reduce((map, item) => {
      if (item.productKey) map[item.productKey] = item;
      return map;
    }, {} as Partial<Record<ProductKey, CatalogItem>>),
    [catalogItems]
  );

  const activeItem = catalogByKey[activeKey];

  const fmt = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const goToSlide = useCallback((index: number) => {
    const newKey = SLIDE_CONFIG[index].productKey;
    const isSameProduct = newKey === SLIDE_CONFIG[slideIndex]?.productKey;
    // NOTE: do NOT set heroPhase here — phase effect handles it to avoid blank flash
    if (isSameProduct) {
      // Same video keeps playing — no crossfade, no animKey reset (text already in place)
      setSlideIndex(index);
      onSelectProduct(newKey);
    } else {
      // New product — crossfade video, reset text animations
      setIsTransitioning(true);
      setTimeout(() => {
        setSlideIndex(index);
        setAnimKey((k) => k + 1);
        onSelectProduct(newKey);
        setIsTransitioning(false);
      }, 700);
    }
  }, [slideIndex, onSelectProduct]);

  const advance = useCallback(() => {
    goToSlide((slideIndex + 1) % TOTAL_SLIDES);
  }, [slideIndex, goToSlide]);

  // Keep advanceRef current so phase timers can call it without stale closure
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  const handleVideoEnded = useCallback(() => {
    if (!isDesktop) advanceRef.current();
  }, [isDesktop]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Phase cascade
  useEffect(() => {
    if (isDesktop) {
      // Desktop: always show content, auto-advance after 9.5s
      setHeroPhase(2);
      const t = setTimeout(() => advanceRef.current(), 9500);
      return () => clearTimeout(t);
    }
    // Mobile: video plays → video onEnded → phase 1 → 8s timer (handled separately)
    setHeroPhase(0);
  }, [slideIndex, isDesktop]);

  /* ── Editorial slideshow: cross-fade between slides ── */
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setEditorialFading(true);
      setTimeout(() => {
        setEditorialSlide((s) => (s + 1) % EDITORIAL_SLIDES.length);
        setEditorialFading(false);
      }, 500);
    }, SLIDESHOW_MS);
    return () => clearInterval(slideTimer);
  }, []);

  const bullets = activeStory.details.split('<br>').filter(Boolean);

  const onNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) { window.alert('Please enter your email.'); return; }
    window.alert(`Thanks for subscribing, ${newsletterEmail.trim()}.`);
    setNewsletterEmail('');
  };

  return (
    <main id="main-content" style={{ background: 'var(--paper-0, #FAF6EF)', color: 'var(--ink-0, #0B0806)' }}>

      {/* ── HERO CAROUSEL ───────────────────────────────────────────── */}
      <section
        id="sanctuary"
        className="relative min-h-[100svh] overflow-hidden"
        style={{ background: 'var(--paper-0, #FAF6EF)' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 48) {
            if (diff > 0) goToSlide((slideIndex + 1) % TOTAL_SLIDES);
            else goToSlide((slideIndex - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
          }
        }}
      >
        {/* Giant ghosted product name — left-anchored, sits behind image */}
        <div
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
          style={{ zIndex: 1 }}
        >
          <h2
            key={`bg-${animKey}`}
            className="font-display uppercase leading-none hero-bg-text-enter"
            style={{
              fontSize: 'clamp(7rem, 22vw, 20rem)',
              letterSpacing: '-0.04em',
              color: `rgba(${theme.glow}, 0.06)`,
              whiteSpace: 'nowrap',
              paddingLeft: '3vw',
              fontWeight: 900,
            }}
          >
            {activeStory.featureName}
          </h2>
        </div>

        {/* Warm radial tint — right panel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: `radial-gradient(ellipse 55% 75% at 75% 55%, rgba(${theme.glow},0.08), transparent 65%)`,
            transition: 'background 0.9s ease',
          }}
        />

        {/* ── HERO MEDIA — positioned relative to section (full-width) ── */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.7s ease',
          pointerEvents: 'none',
        }}>
          <HeroProductMedia
            activeItem={activeItem}
            activeProduct={activeKey}
            activeStory={activeStory}
            glow={theme.glow}
            onVideoEnded={handleVideoEnded}
          />
        </div>

        {/* ── MOBILE TEXT OVERLAY — portrait/mobile only ── */}
        <div
          className="absolute inset-0 md:hidden"
          style={{ zIndex: 15, pointerEvents: 'none' }}
        >
          {/* Left-side gradient scrim for text readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to right, rgba(${theme.glow},0.72) 0%, rgba(${theme.glow},0.25) 55%, transparent 100%)`,
            pointerEvents: 'none',
          }} />
          {/* Bottom gradient for CTAs */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
            background: `linear-gradient(to top, rgba(${theme.glow},0.80) 0%, transparent 100%)`,
            pointerEvents: 'none',
          }} />

          {/* TOP-LEFT: eyebrow + product name + tagline */}
          <div
            key={`mob-left-${animKey}`}
            style={{
              position: 'absolute',
              top: '18%',
              left: '6%',
              right: '45%',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
              fontSize: '9px',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'rgba(250,246,239,0.72)',
              marginBottom: 10,
            }}>
              {String(slideIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;03&nbsp;·&nbsp;Origin
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display, Syncopate, sans-serif)',
              fontSize: 'clamp(1.75rem, 9vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              lineHeight: 0.92,
              color: '#FFFFFF',
              margin: 0,
            }}>
              {activeStory.featureName}
            </h1>
            <p style={{
              fontFamily: 'var(--font-serif, Fraunces, serif)',
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: theme.accent === '#7C4A2A' ? '#C8965A' : theme.accent,
              marginTop: 8,
            }}>
              {activeStory.title}
            </p>
          </div>

          {/* RIGHT-SIDE: description + feature bullets */}
          <div
            key={`mob-right-${animKey}`}
            style={{
              position: 'absolute',
              top: '38%',
              right: '4%',
              left: '52%',
            }}
          >
            <p style={{
              fontSize: '0.7rem',
              lineHeight: 1.55,
              color: 'rgba(250,246,239,0.82)',
              fontFamily: 'var(--font-sans)',
              marginBottom: 12,
            }}>
              {activeStory.desc.slice(0, 120)}…
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {bullets.slice(0, 3).map((b) => (
                <span key={b} style={{
                  fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                  fontSize: '8px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  border: `1px solid rgba(250,246,239,0.35)`,
                  background: `rgba(${theme.glow},0.25)`,
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}>{b}</span>
              ))}
            </div>
          </div>

          {/* BOTTOM: price + CTA buttons */}
          <div style={{
            position: 'absolute',
            bottom: '10%',
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            pointerEvents: 'auto',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif, Fraunces, serif)',
              fontSize: '1.375rem',
              fontWeight: 600,
              color: '#FFFFFF',
              margin: 0,
            }}>
              {activeItem ? fmt(activeItem.price) : activeStory.price}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={() => onBrowseCollection()}
                style={{
                  background: 'rgba(11,8,6,0.65)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.65)',
                  color: '#fff',
                  padding: '12px 28px',
                  fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: 2,
                }}
              >Shop Now</button>
              <button
                type="button"
                onClick={() => onSelectProduct(activeKey)}
                style={{
                  background: 'transparent',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.45)',
                  color: 'rgba(255,255,255,0.9)',
                  padding: '12px 28px',
                  fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: 2,
                }}
              >Explore</button>
            </div>
          </div>
        </div>

        {/* ── SPLIT LAYOUT ── */}
        <div className="relative flex min-h-[100svh]" style={{ zIndex: 10 }}>

          {/* LEFT PANEL — editorial text content, revealed at phase 2 */}
          <div className="relative flex w-full flex-col justify-start overflow-hidden px-8 pb-12 pt-28 md:w-[48%] md:justify-center md:px-14 md:pb-28 md:pt-32 lg:px-20 xl:px-24">
            {/* Mobile gradient scrim — always present so text is readable */}
            <div
              className="absolute inset-0 pointer-events-none md:hidden"
              style={{
                background: 'linear-gradient(to bottom, rgba(250,246,239,0.55) 0%, rgba(250,246,239,0.88) 100%)',
                zIndex: 0,
                opacity: heroPhase >= 2 ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            />

            {/* Slide counter + eyebrow — always visible */}
            <p
              key={`label-${animKey}`}
              className="mb-5 font-display text-[10px] uppercase tracking-[0.44em] carousel-text-enter"
              style={{ color: (isDesktop || heroPhase >= 2) ? theme.accent : 'rgba(255,255,255,0.75)', position: 'relative', zIndex: 1, transition: 'color 0.6s ease' }}
            >
              {String(slideIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;03&nbsp;&nbsp;·&nbsp;&nbsp;Himalayan Origin
            </p>
            {/* Content panel — fades in at phase 2 */}
            <div style={{
              opacity: (isDesktop || heroPhase >= 2) ? 1 : 0,
              transform: (isDesktop || heroPhase >= 2) ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.55s ease',
              position: 'relative', zIndex: 1,
            }}>

              {/* Product name — massive */}
              <h1
                key={`title-${animKey}`}
                className="font-display uppercase leading-[0.9] tracking-tighter carousel-text-enter"
                style={{
                  fontSize: 'clamp(2rem, 8vw, 4.4rem)',
                  color: theme.primary,
                  animationDelay: '0.06s',
                  fontWeight: 900,
                }}
              >
                {activeStory.featureName}
              </h1>

              {/* Tagline italic */}
              <p
                key={`tag-${animKey}`}
                className="mt-3 font-headline text-base italic carousel-text-enter md:text-lg"
                style={{ color: theme.accent, animationDelay: '0.1s' }}
              >
                {activeStory.title}
              </p>

              {/* Accent rule */}
              <div
                className="my-5 h-px w-12 carousel-text-enter"
                style={{ background: `rgba(${theme.glow},0.45)`, animationDelay: '0.13s' }}
              />

              {/* Description */}
              <p
                key={`desc-${animKey}`}
                className="max-w-sm text-sm leading-relaxed carousel-text-enter"
                style={{ color: '#4A3A30', animationDelay: '0.16s' }}
              >
                {activeStory.desc}
              </p>

              {/* Feature tags */}
              <div
                key={`tags-${animKey}`}
                className="mt-6 flex flex-wrap gap-2 carousel-text-enter"
                style={{ animationDelay: '0.2s' }}
              >
                {bullets.slice(0, 3).map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.16em]"
                    style={{
                      border: `1px solid rgba(${theme.glow},0.32)`,
                      background: `rgba(${theme.glow},0.05)`,
                      color: theme.primary,
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>

              {/* Price + CTAs */}
              <div
                key={`cta-${animKey}`}
                className="mt-8 flex flex-col gap-4 carousel-text-enter sm:flex-row sm:items-center"
                style={{ animationDelay: '0.24s' }}
              >
                <p
                  className="font-display text-2xl font-bold tracking-tight"
                  style={{ color: theme.primary }}
                >
                  {activeItem ? fmt(activeItem.price) : activeStory.price}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onAddDetailToCart}
                    className="px-9 py-3.5 font-headline text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: theme.primary,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    Shop Now
                  </button>
                  <button
                    type="button"
                    onClick={onBrowseCollection}
                    className="px-9 py-3.5 font-headline text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      border: `1.5px solid rgba(${theme.glow},0.45)`,
                      color: theme.primary,
                      background: 'rgba(250,246,239,0.25)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>{/* end content panel wrapper */}
          </div>

        </div>

        {/* ── CAROUSEL DOTS — 3 slides ── */}
        <div
          className="absolute bottom-10 left-8 flex items-center gap-1 md:left-14 lg:left-20 xl:left-24"
          style={{ zIndex: 30 }}
        >
          {SLIDE_CONFIG.map((pos, i) => {
            const isActive = i === slideIndex;
            return (
              <button
                key={i}
                type="button"
                aria-label={`${productStories[pos.productKey].featureName} video`}
                onClick={() => goToSlide(i)}
                className="h-1.5 transition-all duration-500 hover:opacity-80"
                style={{
                  width: isActive ? '22px' : '6px',
                  borderRadius: '3px',
                  background: isActive
                    ? theme.primary
                    : `rgba(${theme.glow},0.20)`,
                }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        {!isPaused && (
          <div
            className="absolute bottom-0 left-0 h-[2px] w-full"
            style={{ zIndex: 30, background: `rgba(${theme.glow},0.12)` }}
          >
            <div
              key={animKey}
              className="h-full carousel-progress"
              style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})` }}
            />
          </div>
        )}
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--ink-0, #0B0806)', overflow: 'hidden', padding: '14px 0' }}>
        <div style={{ display: 'flex', animation: 'marquee 40s linear infinite', whiteSpace: 'nowrap' }}>
          {['MOON RITUALS', 'PROPHETIC WELLNESS', 'PURE ORIGINS', 'HIMALAYAN · KASHMIRI · ORCHARD', 'NATURALLY YOURS',
            'MOON RITUALS', 'PROPHETIC WELLNESS', 'PURE ORIGINS', 'HIMALAYAN · KASHMIRI · ORCHARD', 'NATURALLY YOURS',
            'MOON RITUALS', 'PROPHETIC WELLNESS', 'PURE ORIGINS', 'HIMALAYAN · KASHMIRI · ORCHARD', 'NATURALLY YOURS'].map((p, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, paddingRight: 32 }}>
                <span style={{
                  fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
                  color: 'rgba(250,246,239,0.7)',
                }}>{p}</span>
                <span style={{ color: 'var(--saffron-500, #D2571B)', fontSize: 14 }}>·</span>
              </span>
            ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ────────────────────────────────────────── */}
      <section style={{ background: 'var(--paper-0, #FAF6EF)', padding: 'clamp(32px,6vw,56px) clamp(16px,4vw,64px) 20px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
            fontSize: '0.6875rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', fontWeight: 700,
            color: 'var(--ink-3, #8A7A66)', marginBottom: 16,
          }}>The Archive · 06 Essentials</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(({ label }, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => { setActiveCategoryIndex(idx); onBrowseCollection(); }}
                style={{
                  border: idx === activeCategoryIndex
                    ? '1px solid var(--ink-0, #0B0806)'
                    : '1px solid var(--hairline, rgba(11,8,6,0.12))',
                  padding: '8px 20px',
                  fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                  fontSize: '0.625rem', letterSpacing: '0.16em',
                  textTransform: 'uppercase', fontWeight: 700,
                  background: idx === activeCategoryIndex ? 'var(--ink-0, #0B0806)' : 'transparent',
                  color: idx === activeCategoryIndex ? 'var(--paper-0, #FAF6EF)' : 'var(--ink-2, #4A3E31)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT COLLECTION ──────────────────────────────────────── */}
      <section id="rituals" style={{
        background: 'var(--paper-0, #FAF6EF)',
        padding: '16px clamp(16px,4vw,64px) clamp(48px,8vw,96px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            marginBottom: 32, flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-serif, Fraunces, serif)',
                fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
                lineHeight: 1.12, letterSpacing: '-0.01em', fontWeight: 400,
                color: 'var(--ink-0, #0B0806)', margin: 0,
              }}>
                Curated by origin, <em>not by trend.</em>
              </h2>
              <p style={{
                marginTop: 8, fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                color: 'var(--ink-2, #4A3E31)', maxWidth: '36ch',
              }}>
                Single-origin staples — each jar carries the place, season and hands that made it.
              </p>
            </div>
            <button
              type="button"
              onClick={onBrowseCollection}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: 700, color: 'var(--ink-0)',
                borderBottom: '1px solid var(--ink-0)',
                padding: '4px 0',
              }}
            >
              View full catalogue →
            </button>
          </div>

          <div id="shop" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
            gap: '20px',
          }}>
            {catalogItems.map((item) => {
              const ct = item.productKey ? (CARD_THEMES[item.productKey] ?? DEFAULT_CARD) : DEFAULT_CARD;
              return (
                <article
                  key={item.id}
                  className="group moon-card-v2 stagger-up"
                  style={{
                    border: '1px solid rgba(11,8,6,0.08)',
                    background: 'var(--paper-0, #FAF6EF)',
                    cursor: 'pointer',
                    ['--card-accent' as string]: ct.accentColor,
                    boxShadow: '0 1px 8px rgba(11,8,6,0.07), 0 4px 20px rgba(11,8,6,0.04)',
                  }}
                  onClick={() => onProductClick(item)}
                >
                  {/* Image section — product-themed dark background */}
                  <div className="moon-img-shimmer" style={{ position: 'relative', overflow: 'hidden', background: ct.imgBg }}>
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="group-hover:scale-[1.04]"
                      style={{
                        height: 260, width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 700ms var(--ease-out)',
                        display: 'block',
                      }}
                    />
                    {/* Bottom gradient in product accent color */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                      background: `linear-gradient(to top, ${ct.imgBg.match(/#[0-9A-Fa-f]{6}/)?.[1] ?? '#0B0806'}CC 0%, transparent 100%)`,
                      pointerEvents: 'none', zIndex: 2,
                    }} />
                    {item.featured && (
                      <span style={{
                        position: 'absolute', left: 12, top: 12, zIndex: 3,
                        background: ct.accentColor, color: '#fff',
                        padding: '4px 10px',
                        fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                        letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                        boxShadow: `0 2px 12px ${ct.accentColor}55`,
                      }}>Best Seller</span>
                    )}
                  </div>

                  <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{
                      fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: 'var(--ink-3, #8A7A66)',
                    }}>{item.subtitle || 'Moon · Origin'}</div>
                    <h3 style={{
                      fontFamily: 'var(--font-serif, Fraunces, serif)',
                      fontSize: '1.125rem', fontWeight: 500,
                      color: 'var(--ink-0, #0B0806)', margin: 0,
                    }}>{item.title}</h3>
                    <span style={{ fontSize: 11, color: ct.starColor, marginTop: 4, letterSpacing: 2 }}>★★★★★</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                      <span style={{
                        fontFamily: 'var(--font-serif, Fraunces, serif)',
                        fontSize: '1.125rem', fontWeight: 500,
                        color: ct.accentColor,
                      }}>{fmt(item.price)}</span>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); onAddCatalogToCart(item); }}
                        style={{
                          background: ct.btnBg,
                          color: '#fff',
                          border: 'none',
                          padding: '8px 16px',
                          fontFamily: 'var(--font-mark)',
                          fontSize: '0.5625rem',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          cursor: 'pointer',
                          borderRadius: 2,
                          whiteSpace: 'nowrap',
                          transition: 'filter 0.2s, transform 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                      >Add to Cart</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL / BRAND STORY — live frame slideshow ──────────── */}
      <section id="archives" style={{ background: 'var(--paper-1, #F4EDE2)', overflow: 'hidden' }}>
        <div className="mx-auto grid w-full max-w-7xl md:grid-cols-2">

          {/* LEFT — static product image with cross-fade between slides */}
          <div className="group relative h-[420px] overflow-hidden md:h-[640px]">
            {/* Static mid-point frame — grayscale by default, full color on hover */}
            <img
              src={EDITORIAL_SLIDES[editorialSlide].image}
              alt={EDITORIAL_SLIDES[editorialSlide].title}
              className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0"
              style={{
                opacity: editorialFading ? 0 : 1,
                transition: 'opacity 0.5s ease, filter 0.8s ease',
              }}
            />
            {/* Overlay gradient for readability */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(${EDITORIAL_SLIDES[editorialSlide].accent === '#2C1810' ? '44,24,16' : EDITORIAL_SLIDES[editorialSlide].accent === '#C44A0C' ? '196,74,12' : '139,96,0'},0.55) 0%, transparent 50%)`,
                transition: 'background 0.5s ease',
              }}
            />
            {/* Slide label bottom-left */}
            <div className="absolute bottom-6 left-6 right-6">
              <p
                className="font-display text-[10px] uppercase tracking-[0.36em]"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {String(editorialSlide + 1).padStart(2, '0')} / {String(EDITORIAL_SLIDES.length).padStart(2, '0')}
              </p>
              <p
                className="mt-1 font-display text-2xl uppercase tracking-tight text-white"
                style={{ opacity: editorialFading ? 0 : 1, transition: 'opacity 0.5s ease' }}
              >
                {EDITORIAL_SLIDES[editorialSlide].tagline}
              </p>
            </div>
            {/* Slide dots */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {EDITORIAL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Editorial slide ${i + 1}`}
                  onClick={() => { setEditorialSlide(i); }}
                  className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: i === editorialSlide ? 'white' : 'rgba(255,255,255,0.35)',
                    transform: i === editorialSlide ? 'scale(1.5)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — editorial text */}
          <div
            className="flex flex-col justify-center space-y-6 px-8 py-16 md:px-14 lg:px-16"
            style={{
              opacity: editorialFading ? 0.6 : 1,
              transition: 'opacity 0.5s ease',
            }}
          >
            <p className="font-display text-xs uppercase tracking-[0.35em] text-zinc-400">The Archive</p>
            <h2
              className="font-headline text-4xl leading-tight tracking-tight text-zinc-900 md:text-5xl"
              style={{ transition: 'color 0.5s ease' }}
            >
              {EDITORIAL_SLIDES[editorialSlide].title}
              <br />
              <em className="font-normal italic" style={{ color: EDITORIAL_SLIDES[editorialSlide].light }}>
                {EDITORIAL_SLIDES[editorialSlide].tagline}
              </em>
            </h2>
            <div
              className="h-px w-16 transition-all duration-500"
              style={{ background: EDITORIAL_SLIDES[editorialSlide].accent }}
            />
            <p className="text-base leading-loose text-zinc-600">
              {EDITORIAL_SLIDES[editorialSlide].desc}
            </p>
            <p className="text-sm leading-loose text-zinc-500">
              Each MOON product embodies centuries of traditional sourcing — from Shilajit resin harvested at 16,000 ft to Mongra saffron threads hand-sorted at dawn. Pure. Potent. Purposeful.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBrowseCollection}
                className="inline-block border border-zinc-300 px-8 py-3 font-label text-xs uppercase tracking-[0.2em] text-zinc-700 transition-all hover:border-zinc-500 hover:text-zinc-900"
              >
                Explore Our Story
              </button>
              {/* Slideshow dots (desktop) */}
              <div className="flex gap-2">
                {EDITORIAL_SLIDES.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={s.title}
                    onClick={() => { setEditorialSlide(i); }}
                    className="h-2 rounded-full transition-all duration-400"
                    style={{
                      width: i === editorialSlide ? '24px' : '8px',
                      background: i === editorialSlide ? EDITORIAL_SLIDES[i].accent : 'rgba(0,0,0,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--paper-1, #F4EDE2)',
        borderTop: '1px solid var(--hairline, rgba(11,8,6,0.12))',
        borderBottom: '1px solid var(--hairline, rgba(11,8,6,0.12))',
        padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,64px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle radial tint */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(210,87,27,0.04), transparent 65%)' }} />
        <div style={{
          maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1,
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(16px,3vw,24px)',
        }} className="md:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="moon-stat-v2">
              <p style={{
                fontFamily: 'var(--font-serif, Fraunces, serif)',
                fontSize: 'clamp(2rem,5vw,3.5rem)',
                fontWeight: 300, lineHeight: 1,
                color: 'var(--saffron-500, #D2571B)',
                letterSpacing: '-0.02em', margin: 0,
              }}>{value}</p>
              <p style={{
                marginTop: 12,
                fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                fontSize: '0.625rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--ink-3, #8A7A66)',
              }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE MOON PROMISE ────────────────────────────────────────── */}
      <section style={{
        background: '#1A0E07',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Ambient radial glows */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 0% 50%, rgba(194,137,30,0.06), transparent 60%), radial-gradient(ellipse 50% 60% at 100% 50%, rgba(194,137,30,0.04), transparent 60%)',
        }} />

        <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Section header — editorial two-column */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)',
            alignItems: 'end', padding: 'clamp(56px,9vw,100px) clamp(16px,4vw,64px) 0',
          }} className="promise-header">
            <div>
              <div style={{
                fontFamily: 'var(--font-mark)', fontSize: '1rem',
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: '#C2891E', marginBottom: 20,
              }}>Why Moon</div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem,5vw,3.8rem)',
                fontWeight: 300, lineHeight: 1.04, letterSpacing: '-0.01em',
                color: '#F5EEE3', margin: 0,
              }}>
                We stake our name<br /><em style={{ color: '#C2891E', fontStyle: 'italic' }}>on every jar.</em>
              </h2>
            </div>
            <div style={{ paddingBottom: 8 }}>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '1rem',
                lineHeight: 1.75, color: 'rgba(245,238,227,0.5)',
                maxWidth: '40ch',
              }}>
                Four commitments, made before a single product leaves Kashmir — the same ones we make to every customer, every order.
              </p>
            </div>
          </div>

          {/* Promise pillars grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: '20px',
            borderTop: '1px solid rgba(245,238,227,0.06)',
            paddingTop: 'clamp(40px,6vw,64px)',
            marginTop: 'clamp(40px,6vw,64px)',
          }}>
            {[
              {
                num: '01',
                title: 'Single-Origin Sourced',
                desc: 'Every product traces to one geography — no blending, no dilution. Kashmir Valley, Himalayan highlands, Kashmiri orchards. The provenance is on the label because we stand behind it.',
                bgImage: '/pillars/saffron.png',
              },
              {
                num: '02',
                title: 'Third-Party Lab Tested',
                desc: 'Each batch is verified by an independent laboratory for purity, potency and the absence of adulterants before it leaves our facility. You see the report, not just our word.',
                bgImage: '/pillars/honey.png',
              },
              {
                num: '03',
                title: 'Direct from Farmers',
                desc: 'No brokers, no aggregators, no middlemen. We work directly with growers, paying fair prices at farm gate and maintaining year-round relationships beyond the harvest.',
                bgImage: '/pillars/shilajit.png',
              },
              {
                num: '04',
                title: 'Small Seasonal Batches',
                desc: 'We harvest with the season, not against it. Limited runs mean every jar is fresh. When a batch sells out, it\'s gone until the next harvest cycle — we don\'t restock with old stock.',
                bgImage: '/pillars/moon.png',
                bgPos: '85% center',
              },
            ].map(({ num, title, desc, bgImage, bgPos }, i) => (
              <div
                key={num}
                style={{
                  position: 'relative',
                  padding: 'clamp(32px,4vw,48px) clamp(20px,3vw,36px)',
                  border: '1px solid rgba(245,238,227,0.06)',
                  borderRadius: '12px',
                  transition: 'border-color 0.4s ease, transform 0.4s ease',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,238,227,0.2)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  const bg = e.currentTarget.querySelector('.promise-bg') as HTMLElement;
                  if (bg) {
                    bg.style.opacity = '0.6';
                    bg.style.transform = 'scale(1.05)';
                  }
                  const titleEl = e.currentTarget.querySelector('h3') as HTMLElement;
                  if (titleEl) {
                    titleEl.style.fontWeight = '700';
                    titleEl.style.textShadow = '0 2px 10px rgba(0,0,0,0.5)';
                  }
                  const descEl = e.currentTarget.querySelector('p') as HTMLElement;
                  if (descEl) {
                    descEl.style.color = 'rgba(255,255,255,0.7)';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,238,227,0.06)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  const bg = e.currentTarget.querySelector('.promise-bg') as HTMLElement;
                  if (bg) {
                    bg.style.opacity = '0.15';
                    bg.style.transform = 'scale(1)';
                  }
                  const titleEl = e.currentTarget.querySelector('h3') as HTMLElement;
                  if (titleEl) {
                    titleEl.style.fontWeight = '400';
                    titleEl.style.textShadow = 'none';
                  }
                  const descEl = e.currentTarget.querySelector('p') as HTMLElement;
                  if (descEl) {
                    descEl.style.color = 'rgba(245,238,227,0.42)';
                  }
                }}
              >
                {/* Background Image Layer */}
                <div
                  className="promise-bg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: bgPos || 'center',
                    opacity: 0.15,
                    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 0,
                  }}
                />

                {/* Content Layer */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(3rem,5vw,4.5rem)',
                    fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em',
                    color: 'rgba(194,137,30,0.15)',
                    marginBottom: 28,
                    userSelect: 'none',
                    transition: 'color 0.4s ease',
                  }}>{num}</div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.1rem,1.6vw,1.4rem)',
                    fontWeight: 400, lineHeight: 1.22,
                    color: '#F5EEE3',
                    marginBottom: 16,
                    transition: 'font-weight 0.4s ease, text-shadow 0.4s ease',
                  }}>{title}</h3>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem', lineHeight: 1.72,
                    color: 'rgba(245,238,227,0.42)',
                    transition: 'color 0.4s ease',
                  }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
            padding: 'clamp(28px,4vw,40px) clamp(16px,4vw,64px)',
            borderTop: '1px solid rgba(245,238,227,0.06)',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
              color: 'rgba(245,238,227,0.35)', maxWidth: '50ch',
            }}>
              Every claim on this page is backed by documentation available on request.
            </p>
            <button
              type="button"
              onClick={onBrowseCollection}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                color: '#C2891E', borderBottom: '1px solid #C2891E',
                padding: '4px 0', transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#D4A83A'; (e.currentTarget as HTMLElement).style.borderBottomColor = '#D4A83A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#C2891E'; (e.currentTarget as HTMLElement).style.borderBottomColor = '#C2891E'; }}
            >
              Shop the Collection →
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--paper-0, #FAF6EF)',
        padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,64px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
              fontSize: '0.6875rem', letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 16,
            }}>Voices · The Private List</div>
            <h2 style={{
              fontFamily: 'var(--font-serif, Fraunces, serif)',
              fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
              lineHeight: 1.12, fontWeight: 400, letterSpacing: '-0.01em',
              color: 'var(--ink-0)', margin: 0,
            }}>
              Thousands of Indian <em>households</em>, one origin.
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 24,
          }}>
            {TESTIMONIALS.map(({ name, role, quote, rating }) => (
              <figure
                key={name}
                className="moon-testimonial-v2 stagger-up"
                style={{ boxShadow: 'var(--shadow-1)', margin: 0 }}
              >
                <div style={{ marginBottom: 16 }} aria-label={`${rating} stars`}>
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--saffron-500, #D2571B)', fontSize: 14 }} aria-hidden>★</span>
                  ))}
                </div>
                <blockquote style={{
                  fontFamily: 'var(--font-serif, Fraunces, serif)',
                  fontStyle: 'italic', fontSize: '1rem',
                  lineHeight: 1.6, color: 'var(--ink-1, #1F1811)',
                  margin: 0, marginBottom: 20,
                }}>"{quote}"</blockquote>
                <figcaption style={{
                  borderTop: '1px solid var(--hairline, rgba(11,8,6,0.12))',
                  paddingTop: 16,
                }}>
                  <strong style={{
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                    fontWeight: 700, color: 'var(--ink-0)',
                    display: 'block',
                  }}>{name}</strong>
                  <span style={{
                    fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'var(--ink-3)', marginTop: 4, display: 'block',
                  }}>{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────────────── */}
      <section id="journal" style={{
        background: 'var(--paper-1, #F4EDE2)',
        padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,64px)',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gap: 'clamp(32px,6vw,80px)', alignItems: 'center',
          }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <div style={{
                fontFamily: 'var(--font-mark, Syncopate, sans-serif)',
                fontSize: '0.6875rem', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 16,
              }}>Join the Private List</div>
              <h2 style={{
                fontFamily: 'var(--font-serif, Fraunces, serif)',
                fontSize: 'clamp(1.75rem, 3.6vw, 2.5rem)',
                lineHeight: 1.12, fontWeight: 400, letterSpacing: '-0.01em',
                color: 'var(--ink-0)', margin: '0 0 20px',
              }}>
                Letters, <em>not</em> marketing.
              </h2>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '1.125rem',
                lineHeight: 1.75, color: 'var(--ink-2)', maxWidth: '40ch',
              }}>
                A quarterly letter from the moon archive — harvest notes from our growers, small-batch drops, and the occasional recipe. Nothing you could call a newsletter.
              </p>
            </div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={onNewsletterSubmit} id="newsletter">
              <div className="flex flex-col sm:flex-row" style={{ gap: 0 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  aria-label="Email address"
                  required
                  style={{
                    flex: 1,
                    border: '1px solid var(--hairline-strong, rgba(11,8,6,0.22))',
                    background: 'var(--paper-0)',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                    color: 'var(--ink-0)', outline: 'none',
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--saffron-500, #D2571B)', color: '#fff',
                    border: 'none', padding: '14px 28px',
                    fontFamily: 'var(--font-mark)', fontSize: '0.5625rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--saffron-400, #E67336)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--saffron-500, #D2571B)'; }}
                >
                  Subscribe
                </button>
              </div>
              <p style={{
                fontSize: '0.6875rem', color: 'var(--ink-3)', letterSpacing: '0.04em',
              }}>
                No spam, no affiliate links. One letter per season.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
