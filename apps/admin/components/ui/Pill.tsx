'use client';

import type { ReactNode } from 'react';

type PillTone = 'neutral' | 'saffron' | 'sage' | 'plum' | 'terracotta' | 'gold';

interface PillProps {
  children: ReactNode;
  tone?: PillTone;
  size?: 'sm' | 'md';
}

const tones: Record<PillTone, { bg: string; fg: string; bd: string }> = {
  neutral: { bg: 'var(--bg-sunk)', fg: 'var(--ink-2)', bd: 'var(--line)' },
  saffron: { bg: 'var(--saffron-soft)', fg: 'var(--saffron-ink)', bd: 'transparent' },
  sage: { bg: 'var(--sage-soft)', fg: 'var(--sage)', bd: 'transparent' },
  plum: { bg: 'var(--plum-soft)', fg: 'var(--plum)', bd: 'transparent' },
  terracotta: { bg: 'transparent', fg: 'var(--terracotta)', bd: 'var(--terracotta)' },
  gold: { bg: 'transparent', fg: 'var(--gold)', bd: 'var(--gold)' },
};

export function Pill({ children, tone = 'neutral', size = 'sm' }: PillProps) {
  const t = tones[tone] ?? tones.neutral;
  const dims = size === 'sm'
    ? { padding: '2px 9px', fontSize: 11.5 }
    : { padding: '4px 12px', fontSize: 12.5 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      borderRadius: 999, fontWeight: 500,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      letterSpacing: 0,
      ...dims,
    }}>
      {children}
    </span>
  );
}
