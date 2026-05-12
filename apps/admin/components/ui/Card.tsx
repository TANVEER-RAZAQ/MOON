'use client';

import type { CSSProperties, ReactNode } from 'react';

export const cardClass = 'bg-[var(--bg-elev)] border border-[var(--line)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: number;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Card({ children, className = '', padding = 22, title, subtitle, action }: CardProps) {
  return (
    <section className={`${cardClass} ${className}`}>
      {(title || action) && (
        <header className="flex items-end justify-between gap-[16px]" style={{ padding: `${padding}px ${padding}px 0` }}>
          <div>
            {title && <h3 className="display m-0 text-[22px] text-[var(--ink)] leading-[1.1]">{title}</h3>}
            {subtitle && <p className="m-0 mt-[4px] text-[12.5px] text-[var(--ink-3)]">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div style={{ padding }}>{children}</div>
    </section>
  );
}
