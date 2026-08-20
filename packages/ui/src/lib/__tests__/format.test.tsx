import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { formatDate, formatMNT, formatNumber } from '../format';
import { RelativeTime } from '../../components/ui/RelativeTime';
import { StringsContext } from '../../hooks/use-strings';
import { mnStrings } from '../strings.mn';

describe('format helpers', () => {
  it('formatDate uses Asia/Ulaanbaatar (+08) by default', () => {
    expect(formatDate(new Date('2026-08-20T02:05:09Z'))).toBe('2026-08-20 10:05');
    expect(formatDate('2026-08-20T23:30:00Z', { tz: 'UTC', pattern: 'dd.MM.yyyy H:mm:ss' })).toBe(
      '20.08.2026 23:30:00',
    );
    expect(formatDate('nope')).toBe('');
  });

  it('formatNumber / formatMNT group thousands', () => {
    expect(formatNumber(1250000)).toBe('1,250,000');
    expect(formatNumber(-1234.5)).toBe('-1,234.5');
    expect(formatNumber(0.333, { maximumFractionDigits: 1 })).toBe('0.3');
    expect(formatMNT(1250000)).toBe('1,250,000₮');
  });
});

describe('RelativeTime', () => {
  const now = new Date('2026-08-20T10:00:00Z');

  it('renders relative text with absolute title + dateTime', () => {
    render(<RelativeTime date={new Date('2026-08-20T09:55:00Z')} now={now} />);
    const el = screen.getByText('5 min ago');
    expect(el.tagName).toBe('TIME');
    expect(el).toHaveAttribute('dateTime', '2026-08-20T09:55:00.000Z');
    expect(el).toHaveAttribute('title', '2026-08-20 17:55');
  });

  it('handles future, days, and Mongolian strings', () => {
    render(
      <StringsContext.Provider value={mnStrings}>
        <RelativeTime date={new Date('2026-08-22T10:00:00Z')} now={now} />
      </StringsContext.Provider>,
    );
    expect(screen.getByText('2 өдрийн дараа')).toBeInTheDocument();
  });
});
