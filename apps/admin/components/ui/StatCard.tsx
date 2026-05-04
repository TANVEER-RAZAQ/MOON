'use client';

import { cardStyle } from './Card';
import type { CSSProperties } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  tone?: 'ink' | 'gold' | 'terracotta' | 'sage';
}

const colorMap: Record<string, string> = {
  ink: 'var(--ink)',
  gold: 'var(--gold)',
  terracotta: 'var(--terracotta)',
  sage: 'var(--sage)',
};

export function StatCard({ label, value, sub, tone = 'ink' }: StatCardProps) {
  return (
    <div style={{ ...cardStyle, padding: 18 } as CSSProperties}>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
      <div className="display" style={{ fontSize: 38, lineHeight: 1, marginTop: 10, color: colorMap[tone] }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}>{sub}</div>
    </div>
  );
}
