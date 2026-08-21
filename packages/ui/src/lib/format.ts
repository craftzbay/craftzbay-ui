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

/** Intl.DateTimeFormat construction is expensive (~ms); cache per zone. */
const dtfCache = new Map<string, Intl.DateTimeFormat>();

export function getDateTimeFormat(tz: string): Intl.DateTimeFormat {
  let dtf = dtfCache.get(tz);
  if (!dtf) {
    dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    dtfCache.set(tz, dtf);
  }
  return dtf;
}

function parts(d: Date, tz: string) {
  const dtf = getDateTimeFormat(tz);
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
  const fixed = Math.abs(n).toFixed(maximumFractionDigits);
  let [int, frac = ''] = fixed.split('.');
  frac = frac.replace(/0+$/, '');
  // Normalise -0 and values that round to zero (e.g. -0.001) → "0", not "-0".
  const sign = n < 0 && Number(fixed) !== 0 ? '-' : '';
  while (frac.length < minimumFractionDigits) frac += '0';
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, group);
  return `${sign}${int}${frac ? decimal + frac : ''}`;
}

export interface FormatMNTOptions extends Omit<FormatNumberOptions, 'maximumFractionDigits'> {
  /** Abbreviate ≥1,000 as `K` / `M` / `B` with one decimal: `12.4M₮`, `850K₮`. */
  compact?: boolean;
}

/**
 * Mongolian tögrög: grouped integer + `₮` suffix, no space.
 *
 * @example formatMNT(1250000)                    // "1,250,000₮"
 * @example formatMNT(12400000, { compact: true }) // "12.4M₮"
 * @example formatMNT(850000, { compact: true })   // "850K₮"
 */
export function formatMNT(n: number, { compact, ...options }: FormatMNTOptions = {}) {
  if (compact && Number.isFinite(n) && Math.abs(n) >= 1000) {
    const units: Array<[number, string]> = [
      [1e9, 'B'],
      [1e6, 'M'],
      [1e3, 'K'],
    ];
    let idx = units.findIndex(([d]) => Math.abs(n) >= d);
    // 999,999 → "1000.0K" after rounding; promote to the next unit instead.
    if (idx > 0 && Math.abs(n / units[idx][0]).toFixed(1) === '1000.0') idx -= 1;
    const [div, unit] = units[idx];
    return `${formatNumber(n / div, { ...options, maximumFractionDigits: 1 })}${unit}₮`;
  }
  return `${formatNumber(n, { ...options, maximumFractionDigits: 0 })}₮`;
}

/**
 * Display form for Mongolian phone numbers. Accepts `XXXXXXXX`, `+976XXXXXXXX`,
 * `976XXXXXXXX`, or already-spaced input; anything else is returned unchanged.
 *
 * @example formatPhone('99112233')     // "+976 9911 2233"
 * @example formatPhone('+97699112233') // "+976 9911 2233"
 * @example formatPhone('+1 555 0100')  // "+1 555 0100" (non-MN, untouched)
 */
export function formatPhone(input: string): string {
  const digits = input.replace(/[\s\-().]/g, '');
  const m = /^(?:\+?976)?(\d{8})$/.exec(digits);
  if (!m) return input;
  return `+976 ${m[1].slice(0, 4)} ${m[1].slice(4)}`;
}

/**
 * Normalise a Mongolian phone number to E.164 (`+976XXXXXXXX`) for storage.
 * Returns `null` when the input is not an 8-digit MN number.
 */
export function parsePhoneMN(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, '');
  const m = /^(?:\+?976)?(\d{8})$/.exec(digits);
  return m ? `+976${m[1]}` : null;
}
