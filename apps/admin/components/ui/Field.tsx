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
    <label className="block">
      {label && (
        <div className="text-[11.5px] font-medium tracking-[0.04em] uppercase text-[var(--ink-3)] mb-[7px] flex justify-between">
          <span>{label}</span>
          {suffix && <span className="normal-case tracking-normal text-[var(--ink-4)]">{suffix}</span>}
        </div>
      )}
      {children}
      {hint && <div className="mt-[6px] text-[12px] text-[var(--ink-3)]">{hint}</div>}
    </label>
  );
}
