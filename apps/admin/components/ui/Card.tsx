'use client';

import type { CSSProperties, ReactNode } from 'react';

const cardStyle: CSSProperties = {
  background: 'var(--bg-elev)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
};

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Card({ children, style, padding = 22, title, subtitle, action }: CardProps) {
  return (
    <section style={{ ...cardStyle, ...style }}>
      {(title || action) && (
        <header style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: `${padding}px ${padding}px 0`,
          gap: 16,
        }}>
          <div>
            {title && <h3 className="display" style={{ margin: 0, fontSize: 22, color: 'var(--ink)', lineHeight: 1.1 }}>{title}</h3>}
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--ink-3)' }}>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div style={{ padding }}>{children}</div>
    </section>
  );
}

export { cardStyle };
