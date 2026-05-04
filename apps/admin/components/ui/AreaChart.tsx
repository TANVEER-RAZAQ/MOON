'use client';

interface AreaChartProps {
  data: number[];
  height?: number;
  accent?: string;
  subtle?: string;
}

export function AreaChart({ data, height = 180, accent = 'var(--saffron)', subtle = 'var(--saffron-soft)' }: AreaChartProps) {
  const w = 600;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => [i * stepX, height - ((v - min) / span) * (height - 24) - 12]);
  const path = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const fillPath = `${path} L${w},${height} L0,${height} Z`;
  const gradId = `areaGrad-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={subtle} stopOpacity="0.7" />
          <stop offset="100%" stopColor={subtle} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1="0" y1={height * p} x2={w} y2={height * p} stroke="var(--line)" strokeDasharray="2 4" strokeWidth="1" />
      ))}
      <path d={fillPath} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (i === points.length - 1) && (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4" fill={accent} />
          <circle cx={p[0]} cy={p[1]} r="9" fill={accent} fillOpacity="0.18" />
        </g>
      ))}
    </svg>
  );
}
