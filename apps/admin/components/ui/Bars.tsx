'use client';

interface BarsProps {
  data: number[];
  height?: number;
  accent?: string;
}

export function Bars({ data, height = 140, accent = 'var(--saffron)' }: BarsProps) {
  const w = 600;
  const max = Math.max(...data) || 1;
  const barW = Math.max(w / (data.length || 1) - 4, 1);
  if (!data.length) return <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height }} />;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      {data.map((v, i) => {
        const h = Math.max((v / max) * (height - 8), 0);
        return (
          <rect
            key={i}
            x={i * (w / data.length) + 2}
            y={height - h}
            width={barW}
            height={h}
            rx="2"
            fill={i === data.length - 1 ? accent : 'var(--line-strong)'}
            opacity={i === data.length - 1 ? 1 : 0.55}
          />
        );
      })}
    </svg>
  );
}
