'use client';

import { Icon } from './Icon';
import type { ReactNode } from 'react';

interface BtnProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  full?: boolean;
}

const sizes: Record<string, { classes: string; iconSize: number }> = {
  sm: { classes: 'px-[12px] py-[6px] text-[12.5px] rounded-[8px] gap-[6px]', iconSize: 15.5 },
  md: { classes: 'px-[16px] py-[9px] text-[13.5px] rounded-[10px] gap-[8px]', iconSize: 16.5 },
  lg: { classes: 'px-[22px] py-[12px] text-[14.5px] rounded-[12px] gap-[8px]', iconSize: 17.5 },
};

const variants: Record<string, string> = {
  primary: 'bg-[var(--saffron)] text-[#FFF8EC] border border-[var(--saffron)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_0_rgba(70,30,0,0.15)] hover:brightness-110',
  secondary: 'bg-[var(--bg-elev)] text-[var(--ink)] border border-[var(--line-strong)] hover:bg-[var(--bg-hover)]',
  ghost: 'bg-transparent text-[var(--ink-2)] border border-transparent hover:bg-[var(--bg-hover)]',
  soft: 'bg-[var(--saffron-soft)] text-[var(--saffron-ink)] border border-transparent hover:brightness-95',
  danger: 'bg-transparent text-[var(--terracotta)] border border-[var(--line-strong)] hover:bg-[var(--bg-hover)]',
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
  className = '',
  full,
}: BtnProps) {
  const s = sizes[size];
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-sans font-medium whitespace-nowrap transition-all duration-150 ease-out active:translate-y-[1px] disabled:opacity-55 disabled:cursor-not-allowed ${full ? 'w-full' : 'w-auto'} ${s.classes} ${v} ${className}`}
    >
      {icon && <Icon name={icon} size={s.iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.iconSize} />}
    </button>
  );
}
