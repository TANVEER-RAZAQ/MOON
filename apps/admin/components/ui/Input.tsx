'use client';

import { useState } from 'react';
import type { CSSProperties, InputHTMLAttributes } from 'react';

const inputBase: CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 13.5,
  color: 'var(--ink)',
  background: 'var(--bg-sunk)',
  border: '1px solid var(--line)',
  borderRadius: 10,
  padding: '10px 12px',
  outline: 'none',
  transition: 'border-color .15s, box-shadow .15s, background .15s',
};

interface MoonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  style?: CSSProperties;
}

export function MoonInput(props: MoonInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => { setFocus(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); props.onBlur?.(e); }}
      style={{
        ...inputBase,
        borderColor: focus ? 'var(--saffron)' : 'var(--line)',
        boxShadow: focus ? '0 0 0 3px color-mix(in oklab, var(--saffron) 20%, transparent)' : 'none',
        background: focus ? 'var(--bg-elev)' : 'var(--bg-sunk)',
        ...props.style,
      }}
    />
  );
}

export { inputBase };
