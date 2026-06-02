import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tiny, dependency-free chart primitives for inline dashboards — sparklines,
 * KPI cards, at-a-glance trends. For heavy interactive visualisations reach for
 * a charting library. These render as responsive SVG (the line/area stretch to
 * the container width; strokes stay crisp via non-scaling-stroke).
 */

export interface ChartPoint {
  x: string | number;
  y: number;
}

export interface ChartProps {
  data: ChartPoint[];
  /** Drawing height in px. */
  height?: number;
  /** Defaults to fluid 100%. */
  width?: number | string;
  /** Tooltip / label rendered above the chart. */
  caption?: ReactNode;
  /** Faint horizontal gridlines. Default true. */
  grid?: boolean;
  className?: string;
}

// Fixed internal coordinate space; preserveAspectRatio="none" stretches it to
// the container, so this only controls smoothing resolution, not the aspect.
const VB_W = 600;
const PAD = 6;
const GRID_LINES = 4;

function scales(data: ChartPoint[], h: number) {
  const ys = data.map((d) => d.y);
  const min = Math.min(0, ...ys);
  const max = Math.max(...ys, 1);
  const range = max - min || 1;
  const innerW = VB_W - PAD * 2;
  const innerH = h - PAD * 2;
  const sx = (i: number) =>
    data.length <= 1 ? PAD + innerW / 2 : PAD + (i / (data.length - 1)) * innerW;
  const sy = (v: number) => PAD + innerH - ((v - min) / range) * innerH;
  return { sx, sy };
}

/** Catmull-Rom → cubic bézier: a smooth curve through every point. */
function smoothPath(pts: [number, number][]): string {
  if (pts.length === 0) return '';
  if (pts.length < 3) return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function Grid({ height }: { height: number }) {
  const innerH = height - PAD * 2;
  return (
    <g>
      {Array.from({ length: GRID_LINES + 1 }, (_, i) => {
        const y = PAD + (i / GRID_LINES) * innerH;
        return (
          <line
            key={i}
            x1={0}
            x2={VB_W}
            y1={y}
            y2={y}
            stroke="var(--color-border)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            opacity={0.6}
          />
        );
      })}
    </g>
  );
}

function Frame({
  caption,
  height,
  width,
  className,
  children,
}: {
  caption?: ReactNode;
  height: number;
  width: number | string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className={cn('flex flex-col gap-1.5', className)}>
      {caption && <figcaption className="text-xs text-foreground-muted">{caption}</figcaption>}
      <svg
        viewBox={`0 0 ${VB_W} ${height}`}
        width={width}
        height={height}
        preserveAspectRatio="none"
        role="img"
        className="overflow-visible"
      >
        {children}
      </svg>
    </figure>
  );
}

export function LineChart({ data, height = 160, width = '100%', caption, grid = true, className }: ChartProps) {
  const gradId = useId().replace(/:/g, '');
  const { sx, sy } = scales(data, height);
  const pts = data.map((d, i) => [sx(i), sy(d.y)] as [number, number]);
  const line = smoothPath(pts);
  const area = pts.length
    ? `${line} L${pts[pts.length - 1][0].toFixed(1)},${height} L${pts[0][0].toFixed(1)},${height} Z`
    : '';
  const last = pts[pts.length - 1];

  return (
    <Frame caption={caption} height={height} width={width} className={className}>
      <defs>
        <linearGradient id={`area-${gradId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.22} />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
        </linearGradient>
      </defs>
      {grid && <Grid height={height} />}
      {area && <path d={area} fill={`url(#area-${gradId})`} />}
      <path
        d={line}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {last && (
        <circle cx={last[0]} cy={last[1]} r={3.5} fill="var(--color-accent)" vectorEffect="non-scaling-stroke">
          <title>{`${data[data.length - 1].x}: ${data[data.length - 1].y}`}</title>
        </circle>
      )}
    </Frame>
  );
}

export function AreaChart(props: ChartProps) {
  // The line chart already renders a gradient area; alias for intent / naming.
  return <LineChart {...props} />;
}

export function BarChart({ data, height = 160, width = '100%', caption, grid = true, className }: ChartProps) {
  const innerW = VB_W - PAD * 2;
  const innerH = height - PAD * 2;
  const slot = innerW / Math.max(1, data.length);
  const barW = Math.max(2, slot * 0.62);
  const ys = data.map((d) => d.y);
  const max = Math.max(...ys, 1);

  return (
    <Frame caption={caption} height={height} width={width} className={className}>
      {grid && <Grid height={height} />}
      {data.map((d, i) => {
        const h = (d.y / max) * innerH;
        const x = PAD + i * slot + (slot - barW) / 2;
        return (
          <rect
            key={i}
            x={x}
            y={PAD + innerH - h}
            width={barW}
            height={Math.max(0, h)}
            fill="var(--color-accent)"
            rx={2}
            className="transition-opacity hover:opacity-80"
          >
            <title>{`${d.x}: ${d.y}`}</title>
          </rect>
        );
      })}
    </Frame>
  );
}
