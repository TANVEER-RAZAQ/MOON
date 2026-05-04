'use client';

import { Icon } from './Icon';
import type { CSSProperties, ReactNode } from 'react';

interface BtnProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
  full?: boolean;
}

const sizes: Record<string, { padding: string; fontSize: number; borderRadius: number; gap: number }> = {
  sm: { padding: '6px 12px', fontSize: 12.5, borderRadius: 8, gap: 6 },
  md: { padding: '9px 16px', fontSize: 13.5, borderRadius: 10, gap: 8 },
  lg: { padding: '12px 22px', fontSize: 14.5, borderRadius: 12, gap: 8 },
};

const variants: Record<string, CSSProperties> = {
  primary: {
    background: 'var(--saffron)',
    color: '#FFF8EC',
    border: '1px solid var(--saffron)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 0 rgba(70,30,0,0.15)',
  },
  secondary: {
    background: 'var(--bg-elev)',
    color: 'var(--ink)',
    border: '1px solid var(--line-strong)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--ink-2)',
    border: '1px solid transparent',
  },
  soft: {
    background: 'var(--saffron-soft)',
    color: 'var(--saffron-ink)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'transparent',
    color: 'var(--terracotta)',
    border: '1px solid var(--line-strong)',
  },
};

export function Btn({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  onClick,
  disabled,
  type = 'button',
  style,
  full,
}: BtnProps) {
  const s = sizes[size];
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        whiteSpace: 'nowrap',
        transition: 'transform .12s ease, background .15s ease, border-color .15s ease',
        width: full ? '100%' : 'auto',
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.borderRadius,
        gap: s.gap,
        ...v,
        ...style,
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(1px)'; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      {icon && <Icon name={icon} size={s.fontSize + 3} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.fontSize + 3} />}
    </button>
  );
}
