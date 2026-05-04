'use client';

interface BrandProps {
  size?: 'md' | 'lg';
}

export function Brand({ size = 'md' }: BrandProps) {
  const dims = size === 'lg' ? { mark: 36, fontSize: 24 } : { mark: 28, fontSize: 18 };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={dims.mark} height={dims.mark} viewBox="0 0 32 32">
        <defs>
          <mask id="crescent-mask">
            <rect width="32" height="32" fill="white" />
            <circle cx="20" cy="13" r="11" fill="black" />
          </mask>
        </defs>
        <circle cx="16" cy="16" r="14" fill="var(--saffron)" mask="url(#crescent-mask)" />
      </svg>
      <span className="display" style={{ fontSize: dims.fontSize, color: 'var(--ink)', fontWeight: 400, letterSpacing: '-0.01em' }}>
        Moon
        <span style={{ color: 'var(--ink-3)', marginLeft: 6 }}>Admin</span>
      </span>
    </div>
  );
}
