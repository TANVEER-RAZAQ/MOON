'use client';

import type { CSSProperties } from 'react';

interface IconProps {
  name: string;
  size?: number;
  fill?: number;
  weight?: number;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, size = 18, fill = 0, weight = 400, style, className = '' }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
        lineHeight: 1,
        userSelect: 'none',
        ...style,
      }}
    >
      {name}
    </span>
  );
}
