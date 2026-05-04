'use client';

interface PlaceholderProps {
  label?: string;
  w?: number | string;
  h?: number | string;
  aspect?: string;
}

export function Placeholder({ label, w, h, aspect }: PlaceholderProps) {
  return (
    <div className="placeholder-img" style={{
      width: w || '100%',
      height: h || (aspect ? undefined : 120),
      aspectRatio: aspect,
      borderRadius: 12,
      border: '1px solid var(--line)',
    }}>
      {label}
    </div>
  );
}
