'use client';

import type { ReactNode } from 'react';

interface FieldProps {
  label?: string;
  hint?: string;
  children: ReactNode;
  suffix?: ReactNode;
}

export function Field({ label, hint, children, suffix }: FieldProps) {
  return (
    <label style={{ display: 'block' }}>
      {label && (
        <div style={{
          fontSize: 11.5, fontWeight: 500, letterSpacing: '0.04em',
          textTransform: 'uppercase', color: 'var(--ink-3)',
          marginBottom: 7,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{label}</span>
          {suffix && <span style={{ textTransform: 'none', letterSpacing: 0, color: 'var(--ink-4)' }}>{suffix}</span>}
        </div>
      )}
      {children}
      {hint && <div style={{ marginTop: 6, fontSize: 12, color: 'var(--ink-3)' }}>{hint}</div>}
    </label>
  );
}
