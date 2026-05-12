'use client';

import { cardClass } from './Card';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  tone?: 'ink' | 'gold' | 'terracotta' | 'sage';
}

const colorMap: Record<string, string> = {
  ink: 'text-[var(--ink)]',
  gold: 'text-[var(--gold)]',
  terracotta: 'text-[var(--terracotta)]',
  sage: 'text-[var(--sage)]',
};

export function StatCard({ label, value, sub, tone = 'ink' }: StatCardProps) {
  return (
    <div className={`${cardClass} p-[18px]`}>
      <div className="text-[11.5px] text-[var(--ink-3)] tracking-[0.05em] uppercase">{label}</div>
      <div className={`display text-[38px] leading-none mt-[10px] ${colorMap[tone]}`}>{value}</div>
      <div className="text-[12px] text-[var(--ink-3)] mt-[8px]">{sub}</div>
    </div>
  );
}
