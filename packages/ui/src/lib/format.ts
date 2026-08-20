'use client';

/**
 * Dependency-free locale helpers. Defaults target Mongolia (Asia/Ulaanbaatar,
 * `₮` suffix, `,` thousands) but every option is overridable.
 */

export interface FormatDateOptions {
  /** IANA zone. Default `Asia/Ulaanbaatar`. */
  tz?: string;
  /**
   * Tokens: `yyyy` `MM` `dd` `HH` `mm` `ss`, plus `M`/`d`/`H` (unpadded).
   * Default `yyyy-MM-dd HH:mm`.
   */
  pattern?: string;
}

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

function parts(d: Date, tz: string) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const out: Record<string, number> = {};
  for (const p of dtf.formatToParts(d)) {
    if (p.type !== 'literal') out[p.type] = Number(p.value);
  }
  return out;
}

/**
 * Format a date in a fixed time zone with a small token pattern.
 *
 * @example
 *   formatDate(new Date('2026-08-20T02:05:00Z'))            // "2026-08-20 10:05"
 *   formatDate(d, { pattern: 'dd.MM.yyyy', tz: 'UTC' })     // "20.08.2026"
 */
export function formatDate(
  date: Date | number | string,
  { tz = 'Asia/Ulaanbaatar', pattern = 'yyyy-MM-dd HH:mm' }: FormatDateOptions = {},
): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const p = parts(d, tz);
  const hour = p.hour === 24 ? 0 : p.hour;
  return pattern.replace(/yyyy|MM|dd|HH|mm|ss|M|d|H/g, (t) => {
    switch (t) {
      case 'yyyy':
        return String(p.year);
      case 'MM':
        return pad(p.month);
      case 'dd':
        return pad(p.day);
      case 'HH':
        return pad(hour);
      case 'mm':
        return pad(p.minute);
      case 'ss':
        return pad(p.second);
      case 'M':
        return String(p.month);
      case 'd':
        return String(p.day);
      case 'H':
        return String(hour);
      default:
        return t;
    }
  });
}

export interface FormatNumberOptions {
  /** Max fraction digits. Default 2. */
  maximumFractionDigits?: number;
  /** Min fraction digits. Default 0. */
  minimumFractionDigits?: number;
  /** Thousands separator. Default `,`. */
  group?: string;
  /** Decimal separator. Default `.`. */
  decimal?: string;
}

/**
 * Group thousands with a fixed separator (locale-independent, so SSR and
 * client always agree).
 *
 * @example formatNumber(1250000) // "1,250,000"
 */
export function formatNumber(
  n: number,
  {
    maximumFractionDigits = 2,
    minimumFractionDigits = 0,
    group = ',',
    decimal = '.',
  }: FormatNumberOptions = {},
): string {
  if (!Number.isFinite(n)) return '';
  const sign = n < 0 ? '-' : '';
  const fixed = Math.abs(n).toFixed(maximumFractionDigits);
  let [int, frac = ''] = fixed.split('.');
  frac = frac.replace(/0+$/, '');
  while (frac.length < minimumFractionDigits) frac += '0';
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, group);
  return `${sign}${int}${frac ? decimal + frac : ''}`;
}

/**
 * Mongolian tögrög: grouped integer + `₮` suffix, no space.
 *
 * @example formatMNT(1250000) // "1,250,000₮"
 */
export function formatMNT(n: number, options?: Omit<FormatNumberOptions, 'maximumFractionDigits'>) {
  return `${formatNumber(n, { ...options, maximumFractionDigits: 0 })}₮`;
}
