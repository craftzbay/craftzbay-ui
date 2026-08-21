import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatMNT,
  formatNumber,
  formatPhone,
  getDateTimeFormat,
  parsePhoneMN,
} from '../format';

describe('formatDate', () => {
  const d = new Date('2026-02-03T04:05:06Z');

  it('supports every token, padded and unpadded', () => {
    expect(formatDate(d, { tz: 'UTC', pattern: 'yyyy MM dd HH mm ss M d H' })).toBe(
      '2026 02 03 04 05 06 2 3 4',
    );
  });

  it('accepts Date, epoch ms and ISO string', () => {
    const ms = d.getTime();
    expect(formatDate(ms, { tz: 'UTC' })).toBe('2026-02-03 04:05');
    expect(formatDate(d.toISOString(), { tz: 'UTC' })).toBe('2026-02-03 04:05');
  });

  it('shifts across the day boundary in Ulaanbaatar (+08)', () => {
    expect(formatDate('2026-02-03T20:30:00Z')).toBe('2026-02-04 04:30');
    expect(formatDate('2026-12-31T16:00:00Z', { pattern: 'yyyy-MM-dd' })).toBe('2027-01-01');
  });

  it('midnight renders as 00, never 24 (hourCycle h23)', () => {
    expect(formatDate('2026-02-03T16:00:00Z', { pattern: 'HH:mm' })).toBe('00:00');
    expect(formatDate('2026-02-03T00:00:00Z', { tz: 'UTC', pattern: 'H' })).toBe('0');
  });

  it('handles DST zones', () => {
    expect(formatDate('2026-07-01T12:00:00Z', { tz: 'Europe/Berlin', pattern: 'HH:mm' })).toBe(
      '14:00',
    );
    expect(formatDate('2026-01-01T12:00:00Z', { tz: 'Europe/Berlin', pattern: 'HH:mm' })).toBe(
      '13:00',
    );
  });

  it('returns empty string for invalid input', () => {
    expect(formatDate('nope')).toBe('');
    expect(formatDate(NaN)).toBe('');
    expect(formatDate(new Date('x'))).toBe('');
  });

  it('throws on an unknown time zone (Intl RangeError surfaces, not swallowed)', () => {
    expect(() => formatDate(d, { tz: 'Mars/Olympus' })).toThrow(RangeError);
  });

  it('leaves non-token characters untouched', () => {
    expect(formatDate(d, { tz: 'UTC', pattern: 'dd.MM.yyyy, HH:mm (UTC)' })).toBe(
      '03.02.2026, 04:05 (UTC)',
    );
  });

  it('caches the formatter per zone', () => {
    expect(getDateTimeFormat('UTC')).toBe(getDateTimeFormat('UTC'));
    expect(getDateTimeFormat('UTC')).not.toBe(getDateTimeFormat('Asia/Ulaanbaatar'));
  });
});

describe('formatNumber', () => {
  it('groups thousands and trims trailing zeros', () => {
    expect(formatNumber(1234567.5)).toBe('1,234,567.5');
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(0)).toBe('0');
  });

  it('never prints -0', () => {
    expect(formatNumber(-0)).toBe('0');
    expect(formatNumber(-0.001)).toBe('0');
    expect(formatNumber(-0.004, { maximumFractionDigits: 2 })).toBe('0');
  });

  it('keeps the sign for values that survive rounding', () => {
    expect(formatNumber(-0.005)).toBe('-0.01');
    expect(formatNumber(-1)).toBe('-1');
  });

  it('respects min/max fraction digits', () => {
    expect(formatNumber(1.5, { minimumFractionDigits: 2 })).toBe('1.50');
    expect(formatNumber(1, { minimumFractionDigits: 2 })).toBe('1.00');
    expect(formatNumber(1.23456, { maximumFractionDigits: 4 })).toBe('1.2346');
    expect(formatNumber(1.23456, { maximumFractionDigits: 0 })).toBe('1');
  });

  it('custom separators (European)', () => {
    expect(formatNumber(1234567.89, { group: '.', decimal: ',' })).toBe('1.234.567,89');
    expect(formatNumber(1234567, { group: ' ' })).toBe('1 234 567');
  });

  it('large values stay exact up to the safe integer range', () => {
    expect(formatNumber(Number.MAX_SAFE_INTEGER)).toBe('9,007,199,254,740,991');
    expect(formatNumber(1e15)).toBe('1,000,000,000,000,000');
  });

  it('non-finite → empty string', () => {
    expect(formatNumber(NaN)).toBe('');
    expect(formatNumber(Infinity)).toBe('');
    expect(formatNumber(-Infinity)).toBe('');
  });
});

describe('formatMNT', () => {
  it('rounds to whole tögrög and appends ₮ without a space', () => {
    expect(formatMNT(1234.6)).toBe('1,235₮');
    expect(formatMNT(0)).toBe('0₮');
    expect(formatMNT(-2500)).toBe('-2,500₮');
  });

  it('compact thresholds', () => {
    expect(formatMNT(999, { compact: true })).toBe('999₮');
    expect(formatMNT(1000, { compact: true })).toBe('1K₮');
    expect(formatMNT(1500, { compact: true })).toBe('1.5K₮');
    // Rounding must not overflow a unit: 999,999 → 1000.0K is really 1M.
    expect(formatMNT(999_999, { compact: true })).toBe('1M₮');
    expect(formatMNT(999_949, { compact: true })).toBe('999.9K₮');
    expect(formatMNT(999_999_999, { compact: true })).toBe('1B₮');
    expect(formatMNT(1e6, { compact: true })).toBe('1M₮');
    expect(formatMNT(1e9, { compact: true })).toBe('1B₮');
    expect(formatMNT(1.25e12, { compact: true })).toBe('1,250B₮');
  });

  it('compact honours group/decimal overrides', () => {
    expect(formatMNT(1_250_000, { compact: true, decimal: ',' })).toBe('1,3M₮');
  });

  it('non-finite → bare suffix', () => {
    expect(formatMNT(NaN)).toBe('₮');
    expect(formatMNT(Infinity, { compact: true })).toBe('₮');
  });
});

describe('formatPhone / parsePhoneMN', () => {
  it.each([
    ['99112233', '+976 9911 2233', '+97699112233'],
    ['+976 9911 2233', '+976 9911 2233', '+97699112233'],
    ['976-9911-2233', '+976 9911 2233', '+97699112233'],
    ['(976) 9911.2233', '+976 9911 2233', '+97699112233'],
    ['+97699112233', '+976 9911 2233', '+97699112233'],
  ])('%s', (input, display, e164) => {
    expect(formatPhone(input)).toBe(display);
    expect(parsePhoneMN(input)).toBe(e164);
  });

  it.each(['9911223', '991122334', '+1 555 0100', 'abc', '', '+97799112233', '99 11 22 3a'])(
    'rejects %j',
    (input) => {
      expect(formatPhone(input)).toBe(input);
      expect(parsePhoneMN(input)).toBeNull();
    },
  );

  it('does not accept unicode digits', () => {
    expect(parsePhoneMN('９９１１２２３３')).toBeNull();
  });
});
