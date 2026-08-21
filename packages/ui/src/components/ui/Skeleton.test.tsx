import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { act, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing until the default 300ms delay has elapsed', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toBeNull();
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(container.firstElementChild).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(container.firstElementChild).not.toBeNull();
  });

  it('renders immediately with delay={0} and is aria-hidden', () => {
    const { container } = render(<Skeleton delay={0} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).toHaveClass('animate-pulse', 'rounded-md');
  });

  it('keeps the placeholder mounted for minVisible after the delay changes', () => {
    const { container, rerender } = render(<Skeleton delay={0} minVisible={500} />);
    expect(container.firstElementChild).not.toBeNull();
    // Switching to a delayed mode would normally hide it — minVisible holds it.
    rerender(<Skeleton delay={300} minVisible={500} />);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(container.firstElementChild).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(container.firstElementChild).toBeNull();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(container.firstElementChild).not.toBeNull();
  });

  it.each([
    ['text', 'h-3 rounded-sm'],
    ['circle', 'aspect-square rounded-full'],
    ['avatar', 'size-8 rounded-full'],
    ['card', 'rounded-lg'],
  ] as const)('variant %s applies its silhouette classes', (variant, classes) => {
    const { container } = render(<Skeleton delay={0} variant={variant} />);
    expect(container.firstElementChild).toHaveClass(...classes.split(' '));
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton delay={0} ref={ref} className="h-4 w-24" data-testid="sk" />);
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current).toHaveClass('h-4', 'w-24', 'animate-pulse');
    expect(ref.current).toHaveAttribute('data-testid', 'sk');
  });

  it('is axe-clean', async () => {
    vi.useRealTimers();
    const { container } = render(<Skeleton delay={0} className="h-4 w-24" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
