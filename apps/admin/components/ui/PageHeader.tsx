'use client';

import type { ReactNode } from 'react';
import { Btn } from './Btn';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode[];
}

export function PageHeader({ eyebrow, title, subtitle, actions }: PageHeaderProps) {
  return (
    <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
      <div>
        {eyebrow && (
          <div className="mono" style={{
            fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--ink-3)', marginBottom: 8,
          }}>{eyebrow}</div>
        )}
        <h1 className="display" style={{
          margin: 0, fontSize: 44, lineHeight: 1, color: 'var(--ink)',
          fontWeight: 400,
        }}>{title}</h1>
        {subtitle && <p style={{ margin: '10px 0 0', fontSize: 14.5, color: 'var(--ink-2)', maxWidth: 580 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
    </header>
  );
}
