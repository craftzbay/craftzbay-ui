import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from './Timeline';

function Demo() {
  return (
    <Timeline aria-label="Activity">
      <TimelineItem>
        <TimelineTime>2026-08-20T10:00:00Z</TimelineTime>
        <TimelineTitle>Deployed</TimelineTitle>
        <TimelineDescription>v0.10.0 went live.</TimelineDescription>
      </TimelineItem>
      <TimelineItem isLast bullet={<span data-testid="bullet" />}>
        <TimelineTime dateTime="2026-08-19T09:00:00Z">Yesterday</TimelineTime>
        <TimelineTitle>Merged</TimelineTitle>
      </TimelineItem>
    </Timeline>
  );
}

describe('Timeline', () => {
  it('renders an ordered list of items', () => {
    render(<Demo />);
    const list = screen.getByRole('list', { name: 'Activity' });
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('draws a connector except on the last item and honours a custom bullet', () => {
    render(<Demo />);
    const [first, last] = screen.getAllByRole('listitem');
    expect(first.querySelector('.w-px')).not.toBeNull();
    expect(last.querySelector('.w-px')).toBeNull();
    expect(screen.getByTestId('bullet')).toBeInTheDocument();
  });

  it('TimelineTime derives datetime from string children or explicit prop', () => {
    render(<Demo />);
    const times = document.querySelectorAll('time');
    expect(times[0]).toHaveAttribute('datetime', '2026-08-20T10:00:00Z');
    expect(times[1]).toHaveAttribute('datetime', '2026-08-19T09:00:00Z');
    expect(times[1]).toHaveTextContent('Yesterday');
  });

  it('TimelineTime omits an invalid datetime', () => {
    const { container } = render(
      <div>
        <TimelineTime>Yesterday</TimelineTime>
        <TimelineTime dateTime="not-a-date">x</TimelineTime>
        <TimelineTime dateTime="2026-01-01">
          <b>bold</b>
        </TimelineTime>
      </div>,
    );
    const times = container.querySelectorAll('time');
    expect(times[0]).not.toHaveAttribute('datetime');
    expect(times[1]).not.toHaveAttribute('datetime');
    expect(times[2]).toHaveAttribute('datetime', '2026-01-01');
  });

  it('forwards refs and merges className on Timeline + TimelineItem', () => {
    const listRef = createRef<HTMLOListElement>();
    const itemRef = createRef<HTMLLIElement>();
    render(
      <Timeline ref={listRef} className="gap-2" data-testid="tl">
        <TimelineItem ref={itemRef} className="pb-0" data-testid="ti">
          x
        </TimelineItem>
      </Timeline>,
    );
    expect(listRef.current?.tagName).toBe('OL');
    expect(listRef.current).toHaveClass('gap-2', 'flex-col');
    expect(listRef.current).toHaveAttribute('data-testid', 'tl');
    expect(itemRef.current?.tagName).toBe('LI');
    expect(itemRef.current).toHaveClass('pb-0', 'flex');
    expect(itemRef.current).toHaveAttribute('data-testid', 'ti');
  });

  it('is axe-clean', async () => {
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
