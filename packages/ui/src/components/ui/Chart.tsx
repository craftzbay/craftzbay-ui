'use client';

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

export interface ChartSeries {
  /** Name used in the accessible summary and tooltips. */
  name?: string;
  data: ChartPoint[];
}

export interface ChartProps {
  /** Primary series. Ignored when `series` is provided. */
  data?: ChartPoint[];
  /** Multiple series drawn on the same scale. */
  series?: ChartSeries[];
  /**
   * Per-series colours. Defaults to the categorical token list below.
   * TODO(globals.css): add `--chart-1..6` tokens and switch the defaults.
   */
  colors?: string[];
  /** Drawing height in px. */
  height?: number;
  /** Defaults to fluid 100%. */
  width?: number | string;
  /** Visible caption rendered above the chart. Doubles as the accessible name. */
  caption?: ReactNode;
  /** Accessible name when there is no `caption`. */
  'aria-label'?: string;
  /** Alias of `aria-label` (SVG `<title>`). */
  title?: string;
  /** Faint horizontal gridlines. Default true. */
  grid?: boolean;
  /** Y-axis tick labels + first/last x labels. Default true. */
  showAxis?: boolean;
  className?: string;
}

export const DEFAULT_CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
];

// Fixed internal coordinate space; preserveAspectRatio="none" stretches it to
// the container, so this only controls smoothing resolution, not the aspect.
const VB_W = 600;
const PAD = 6;
const GRID_LINES = 4;
const MAX_TICKS = 5;

/** 1234 → "1.2K", 3_400_000 → "3.4M". */
export function abbreviateNumber(n: number): string {
  const abs = Math.abs(n);
  const fmt = (v: number, s: string) => `${(Math.round(v * 10) / 10).toString()}${s}`;
  if (abs >= 1e9) return fmt(n / 1e9, 'B');
  if (abs >= 1e6) return fmt(n / 1e6, 'M');
  if (abs >= 1e3) return fmt(n / 1e3, 'K');
  return Number.isInteger(n) ? String(n) : (Math.round(n * 100) / 100).toString();
}

function resolveSeries(data?: ChartPoint[], series?: ChartSeries[]): ChartSeries[] {
  if (series && series.length) return series;
  return [{ data: data ?? [] }];
}

function domain(all: ChartSeries[], includeZero = true) {
  const ys = all.flatMap((s) => s.data.map((d) => d.y));
  const min = includeZero ? Math.min(0, ...ys) : Math.min(...ys);
  const max = Math.max(...ys, includeZero ? 1 : -Infinity);
  return { min, max: max === -Infinity ? 1 : max, range: max - min || 1 };
}

function scales(length: number, h: number, min: number, range: number) {
  const innerW = VB_W - PAD * 2;
  const innerH = h - PAD * 2;
  const sx = (i: number) => (length <= 1 ? PAD + innerW / 2 : PAD + (i / (length - 1)) * innerW);
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

/** Plain-language summary for the `<desc>` element. */
function describe(all: ChartSeries[]): string {
  return all
    .map((s, i) => {
      const ys = s.data.map((d) => d.y);
      if (!ys.length) return `${s.name ?? `Series ${i + 1}`}: no data`;
      const min = Math.min(...ys);
      const max = Math.max(...ys);
      const last = s.data[s.data.length - 1];
      return `${s.name ?? `Series ${i + 1}`}: ${ys.length} points, min ${min}, max ${max}, last ${last.x}: ${last.y}`;
    })
    .join('. ');
}

function Grid({ height }: { height: number }) {
  const innerH = height - PAD * 2;
  return (
    <g aria-hidden>
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

/**
 * Axis labels are rendered in HTML (not inside the stretched SVG) so the text
 * is never distorted by `preserveAspectRatio="none"`.
 */
function YAxis({ min, max }: { min: number; max: number }) {
  const ticks = Array.from(
    { length: MAX_TICKS },
    (_, i) => max - ((max - min) * i) / (MAX_TICKS - 1),
  );
  return (
    <div
      aria-hidden
      className="tabular text-foreground-subtle pointer-events-none flex shrink-0 flex-col justify-between py-[6px] pr-1.5 text-right text-xs"
    >
      {ticks.map((t, i) => (
        <span key={i} className="leading-none">
          {abbreviateNumber(t)}
        </span>
      ))}
    </div>
  );
}

function XAxis({ first, last }: { first?: ChartPoint; last?: ChartPoint }) {
  if (!first) return null;
  return (
    <div aria-hidden className="text-foreground-subtle flex justify-between text-xs">
      <span>{String(first.x)}</span>
      {last && last !== first && <span>{String(last.x)}</span>}
    </div>
  );
}

function Frame({
  caption,
  ariaLabel,
  title,
  desc,
  height,
  width,
  className,
  showAxis,
  yDomain,
  xFirst,
  xLast,
  children,
}: {
  caption?: ReactNode;
  ariaLabel?: string;
  title?: string;
  desc: string;
  height: number;
  width: number | string;
  className?: string;
  showAxis: boolean;
  yDomain: { min: number; max: number };
  xFirst?: ChartPoint;
  xLast?: ChartPoint;
  children: ReactNode;
}) {
  const id = useId().replace(/:/g, '');
  const captionId = `chart-cap-${id}`;
  const titleId = `chart-title-${id}`;
  const descId = `chart-desc-${id}`;
  const name = ariaLabel ?? title;

  if (import.meta.env?.DEV && !name && !caption) {
    console.warn(
      '[craftzbay/ui] Chart: provide `caption`, `aria-label`, or `title` so the chart has an accessible name.',
    );
  }

  return (
    <figure className={cn('flex flex-col gap-1.5', className)} style={{ width }}>
      {caption && (
        <figcaption id={captionId} className="text-foreground-muted text-xs">
          {caption}
        </figcaption>
      )}
      <div className="flex">
        {showAxis && <YAxis min={yDomain.min} max={yDomain.max} />}
        <svg
          viewBox={`0 0 ${VB_W} ${height}`}
          width="100%"
          height={height}
          preserveAspectRatio="none"
          role="img"
          aria-labelledby={caption ? captionId : name ? titleId : undefined}
          aria-describedby={descId}
          className="min-w-0 flex-1 overflow-visible"
        >
          {name && <title id={titleId}>{name}</title>}
          <desc id={descId}>{desc}</desc>
          {children}
        </svg>
      </div>
      {showAxis && <XAxis first={xFirst} last={xLast} />}
    </figure>
  );
}

export function LineChart({
  data,
  series,
  colors = DEFAULT_CHART_COLORS,
  height = 160,
  width = '100%',
  caption,
  'aria-label': ariaLabel,
  title,
  grid = true,
  showAxis = true,
  className,
}: ChartProps) {
  const all = resolveSeries(data, series);
  const { min, max, range } = domain(all);
  const longest = Math.max(...all.map((s) => s.data.length));
  const primary = all[0].data;

  return (
    <Frame
      caption={caption}
      ariaLabel={ariaLabel}
      title={title}
      desc={describe(all)}
      height={height}
      width={width}
      className={className}
      showAxis={showAxis}
      yDomain={{ min, max }}
      xFirst={primary[0]}
      xLast={primary[primary.length - 1]}
    >
      {grid && <Grid height={height} />}
      {all.map((s, si) => {
        const color = colors[si % colors.length];
        const { sx, sy } = scales(longest, height, min, range);
        const pts = s.data.map((d, i) => [sx(i), sy(d.y)] as [number, number]);
        const line = smoothPath(pts);
        const baseline = sy(Math.max(min, 0));
        const area = pts.length
          ? `${line} L${pts[pts.length - 1][0].toFixed(1)},${baseline.toFixed(1)} L${pts[0][0].toFixed(1)},${baseline.toFixed(1)} Z`
          : '';
        const last = pts[pts.length - 1];
        const lastPoint = s.data[s.data.length - 1];
        return (
          <g key={si}>
            {area && <path d={area} fill={color} fillOpacity={0.08} />}
            <path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {last && (
              <circle
                cx={last[0]}
                cy={last[1]}
                r={3.5}
                fill={color}
                vectorEffect="non-scaling-stroke"
              >
                <title>{`${s.name ? `${s.name} — ` : ''}${lastPoint.x}: ${lastPoint.y}`}</title>
              </circle>
            )}
          </g>
        );
      })}
    </Frame>
  );
}

export function AreaChart(props: ChartProps) {
  // The line chart already renders a flat low-opacity area; alias for intent / naming.
  return <LineChart {...props} />;
}

export function BarChart({
  data,
  series,
  colors = DEFAULT_CHART_COLORS,
  height = 160,
  width = '100%',
  caption,
  'aria-label': ariaLabel,
  title,
  grid = true,
  showAxis = true,
  className,
}: ChartProps) {
  const all = resolveSeries(data, series);
  const innerW = VB_W - PAD * 2;
  const innerH = height - PAD * 2;
  const longest = Math.max(...all.map((s) => s.data.length));
  const slot = innerW / Math.max(1, longest);
  const groupW = slot * 0.62;
  const barW = Math.max(2, groupW / all.length);
  const { max } = domain(all);
  const primary = all[0].data;

  return (
    <Frame
      caption={caption}
      ariaLabel={ariaLabel}
      title={title}
      desc={describe(all)}
      height={height}
      width={width}
      className={className}
      showAxis={showAxis}
      yDomain={{ min: 0, max }}
      xFirst={primary[0]}
      xLast={primary[primary.length - 1]}
    >
      {grid && <Grid height={height} />}
      {all.map((s, si) =>
        s.data.map((d, i) => {
          const h = (Math.max(0, d.y) / max) * innerH;
          const x = PAD + i * slot + (slot - groupW) / 2 + si * barW;
          return (
            <rect
              key={`${si}-${i}`}
              x={x}
              y={PAD + innerH - h}
              width={barW}
              height={Math.max(0, h)}
              fill={colors[si % colors.length]}
              rx={2}
              className="transition-opacity hover:opacity-80"
            >
              <title>{`${s.name ? `${s.name} — ` : ''}${d.x}: ${d.y}`}</title>
            </rect>
          );
        }),
      )}
    </Frame>
  );
}
