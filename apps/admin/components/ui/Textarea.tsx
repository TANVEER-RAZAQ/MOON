'use client';

import { useState } from 'react';
import { inputBase } from './Input';
import type { CSSProperties, TextareaHTMLAttributes } from 'react';

interface MoonTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  style?: CSSProperties;
}

export function MoonTextarea(props: MoonTextareaProps) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      {...props}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
      style={{
        ...inputBase,
        resize: 'vertical' as const,
        minHeight: 90,
        lineHeight: 1.55,
        borderColor: focus ? 'var(--saffron)' : 'var(--line)',
        boxShadow: focus ? '0 0 0 3px color-mix(in oklab, var(--saffron) 20%, transparent)' : 'none',
        background: focus ? 'var(--bg-elev)' : 'var(--bg-sunk)',
        ...props.style,
      }}
    />
  );
}
