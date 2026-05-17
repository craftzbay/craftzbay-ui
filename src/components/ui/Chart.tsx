import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tiny, dependency-free chart primitives for inline dashboards. For complex
 * visualisations reach for a charting library (Recharts, visx). These suffice
 * for sparklines, KPI cards, and at-a-glance trends.
 */

export interface ChartPoint {
  x: string | number;
  y: number;
}

export interface ChartProps {
  data: ChartPoint[];
  /** Defaults to 24px height per point + 60px padding. */
  height?: number;
  /** Defaults to fluid 100%. */
  width?: number | string;
  /** Tooltip / label rendered above the chart. */
  caption?: ReactNode;
  className?: string;
}

function useScales(data: ChartPoint[], w: number, h: number, padding = 8) {
  const ys = data.map((d) => d.y);
  const min = Math.min(0, ...ys);
  const max = Math.max(...ys, 1);
  const range = max - min || 1;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const sx = (i: number) =>
    data.length <= 1 ? padding + innerW / 2 : padding + (i / (data.length - 1)) * innerW;
  const sy = (v: number) => padding + innerH - ((v - min) / range) * innerH;
  return { sx, sy, min, max };
}

export function LineChart({ data, height = 80, width = '100%', caption, className }: ChartProps) {
  const w = typeof width === 'number' ? width : 320;
  const { sx, sy } = useScales(data, w, height);
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(d.y).toFixed(1)}`).join(' ');

  return (
    <figure className={cn('flex flex-col gap-1.5', className)}>
      {caption && <figcaption className="text-xs text-foreground-muted">{caption}</figcaption>}
      <svg viewBox={`0 0 ${w} ${height}`} width={width} height={height} role="img">
        <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <circle key={i} cx={sx(i)} cy={sy(d.y)} r={2} fill="var(--color-accent)" />
        ))}
      </svg>
    </figure>
  );
}

export function AreaChart({ data, height = 80, width = '100%', caption, className }: ChartProps) {
  const w = typeof width === 'number' ? width : 320;
  const { sx, sy } = useScales(data, w, height);
  const top = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(d.y).toFixed(1)}`).join(' ');
  const area = `${top} L${sx(data.length - 1).toFixed(1)},${height} L${sx(0).toFixed(1)},${height} Z`;

  return (
    <figure className={cn('flex flex-col gap-1.5', className)}>
      {caption && <figcaption className="text-xs text-foreground-muted">{caption}</figcaption>}
      <svg viewBox={`0 0 ${w} ${height}`} width={width} height={height} role="img">
        <path d={area} fill="var(--color-accent-soft)" />
        <path d={top} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />
      </svg>
    </figure>
  );
}

export function BarChart({ data, height = 100, width = '100%', caption, className }: ChartProps) {
  const w = typeof width === 'number' ? width : 320;
  const padding = 8;
  const gap = 2;
  const innerW = w - padding * 2;
  const barW = Math.max(2, innerW / data.length - gap);
  const ys = data.map((d) => d.y);
  const max = Math.max(...ys, 1);

  return (
    <figure className={cn('flex flex-col gap-1.5', className)}>
      {caption && <figcaption className="text-xs text-foreground-muted">{caption}</figcaption>}
      <svg viewBox={`0 0 ${w} ${height}`} width={width} height={height} role="img">
        {data.map((d, i) => {
          const h = ((d.y / max) * (height - padding * 2));
          return (
            <rect
              key={i}
              x={padding + i * (barW + gap)}
              y={height - padding - h}
              width={barW}
              height={h}
              fill="var(--color-accent)"
              rx={1.5}
            >
              <title>{`${d.x}: ${d.y}`}</title>
            </rect>
          );
        })}
      </svg>
    </figure>
  );
}
