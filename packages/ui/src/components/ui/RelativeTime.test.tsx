import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { RelativeTime } from './RelativeTime';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const NOW = new Date('2026-08-20T12:00:00Z');
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function at(offsetMs: number) {
  return new Date(NOW.getTime() + offsetMs);
}

describe('RelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    [0, 'just now'],
    [-30_000, 'just now'],
    [-5 * MIN, '5 min ago'],
    [5 * MIN, 'in 5 min'],
    [-3 * HOUR, '3 h ago'],
    [3 * HOUR, 'in 3 h'],
    [-2 * DAY, '2 d ago'],
    [2 * DAY, 'in 2 d'],
  ])('offset %i ms renders "%s" for a fixed now', (offset, label) => {
    render(<RelativeTime date={at(offset)} now={NOW} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('falls back to the absolute date beyond 30 days', () => {
    render(<RelativeTime date={at(-40 * DAY)} now={NOW} absolute={{ tz: 'UTC' }} />);
    const el = document.querySelector('time') as HTMLTimeElement;
    expect(el).toHaveTextContent('2026-07-11 12:00');
    expect(el).toHaveAttribute('title', '2026-07-11 12:00');
  });

  it('emits a valid ISO datetime and an absolute title', () => {
    render(<RelativeTime date="2026-08-20T11:00:00Z" now={NOW} absolute={{ tz: 'UTC' }} />);
    const el = document.querySelector('time') as HTMLTimeElement;
    expect(el).toHaveAttribute('datetime', '2026-08-20T11:00:00.000Z');
    expect(el).toHaveAttribute('title', '2026-08-20 11:00');
    expect(el).toHaveClass('tabular');
  });

  it('accepts numeric timestamps and a numeric now', () => {
    render(<RelativeTime date={NOW.getTime() - 10 * MIN} now={NOW.getTime()} />);
    expect(screen.getByText('10 min ago')).toBeInTheDocument();
  });

  it('omits datetime for an unparsable date', () => {
    render(<RelativeTime date="garbage" now={NOW} />);
    const el = document.querySelector('time') as HTMLTimeElement;
    expect(el).not.toHaveAttribute('datetime');
  });

  it('uses Date.now() deterministically under fake timers when now is omitted', () => {
    vi.useFakeTimers({ now: NOW });
    render(<RelativeTime date={at(-2 * HOUR)} />);
    expect(screen.getByText('2 h ago')).toBeInTheDocument();
  });

  it('renders Mongolian strings from the provider', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <RelativeTime date={at(-5 * MIN)} now={NOW} />
      </DesignSystemProvider>,
    );
    expect(screen.getByText('5 мин өмнө')).toBeInTheDocument();
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<HTMLTimeElement>();
    render(<RelativeTime ref={ref} date={NOW} now={NOW} className="text-xs" data-testid="rt" />);
    expect(ref.current?.tagName).toBe('TIME');
    expect(ref.current).toHaveClass('text-xs', 'tabular');
    expect(ref.current).toHaveAttribute('data-testid', 'rt');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <p>
        Updated <RelativeTime date={at(-5 * MIN)} now={NOW} />
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
