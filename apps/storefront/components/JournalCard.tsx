'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { prepare, layout } from '@chenglou/pretext';

export interface JournalCardProps {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

const FONT_SIZE = 14;
const LINE_HEIGHT_PX = FONT_SIZE * 1.65;
const MAX_LINES = 3;

export function JournalCard({ slug, title, subtitle, category, date, readTime, excerpt }: JournalCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayExcerpt, setDisplayExcerpt] = useState(excerpt);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el || el.clientWidth === 0) return;
      const width = el.clientWidth;
      const font = `${FONT_SIZE}px Manrope`;

      try {
        const result = layout(prepare(excerpt, font), width, LINE_HEIGHT_PX);
        if (result.lineCount <= MAX_LINES) {
          setDisplayExcerpt(excerpt);
          return;
        }
        // Binary-search the char count that fits in MAX_LINES
        let lo = 0, hi = excerpt.length;
        while (lo < hi - 1) {
          const mid = (lo + hi) >> 1;
          const r = layout(prepare(excerpt.slice(0, mid), font), width, LINE_HEIGHT_PX);
          if (r.lineCount <= MAX_LINES) lo = mid; else hi = mid;
        }
        setDisplayExcerpt(excerpt.slice(0, lo).trimEnd() + '\u2026');
      } catch {
        setDisplayExcerpt(excerpt);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [excerpt]);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(11,8,6,0.08)',
        borderRadius: '2px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 24px rgba(11,8,6,0.12)' : '0 1px 4px rgba(11,8,6,0.06)',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          backgroundColor: '#C58A1E',
          color: '#0B0806',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          padding: '3px 10px',
          borderRadius: '999px',
        }}
      >
        {category}
      </span>

      <h2
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: '20px',
          fontWeight: 600,
          color: '#0B0806',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontStyle: 'italic',
          fontSize: '13px',
          color: '#8A7A66',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>

      <div
        ref={containerRef}
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: `${FONT_SIZE}px`,
          color: 'rgba(31,24,17,0.7)',
          lineHeight: LINE_HEIGHT_PX / FONT_SIZE,
          flex: 1,
        }}
      >
        {displayExcerpt}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid rgba(11,8,6,0.08)',
        }}
      >
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '12px',
            color: 'rgba(31,24,17,0.45)',
          }}
        >
          {formatDate(date)} &middot; {readTime}
        </span>
        <Link
          href={`/journal/${slug}`}
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            color: '#D2571B',
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}
        >
          Read Article &rarr;
        </Link>
      </div>
    </article>
  );
}
