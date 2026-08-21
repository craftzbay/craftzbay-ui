import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Progress, ProgressCircle } from './Progress';

describe('Progress', () => {
  it('exposes a progressbar with aria-valuenow and fills proportionally', () => {
    render(<Progress value={40} aria-label="Upload" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    const indicator = bar.firstElementChild as HTMLElement;
    expect(indicator.style.transform).toBe('translateX(-60%)');
    expect(indicator).not.toHaveAttribute('data-motion-keep');
  });

  it('clamps value into [0, max]', () => {
    const { rerender } = render(<Progress value={150} aria-label="p" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<Progress value={-5} aria-label="p" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    rerender(<Progress value={30} max={50} aria-label="p" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '30');
    expect(bar).toHaveAttribute('aria-valuemax', '50');
    expect((bar.firstElementChild as HTMLElement).style.transform).toBe('translateX(-40%)');
  });

  it('is indeterminate when value is omitted / null / NaN', () => {
    const { rerender } = render(<Progress aria-label="p" />);
    let bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar.firstElementChild).toHaveClass('animate-progress-indeterminate');
    expect(bar.firstElementChild).toHaveAttribute('data-motion-keep', '');
    rerender(<Progress value={null} aria-label="p" />);
    bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    rerender(<Progress value={Number.NaN} aria-label="p" />);
    bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('applies size and tone classes', () => {
    render(<Progress value={10} size="lg" tone="danger" aria-label="p" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveClass('h-2');
    expect(bar.firstElementChild).toHaveClass('bg-danger');
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={1} aria-label="p" className="w-40" data-testid="pg" />);
    expect(ref.current).toBe(screen.getByRole('progressbar'));
    expect(ref.current).toHaveClass('w-40', 'rounded-full');
    expect(ref.current).toHaveAttribute('data-testid', 'pg');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <div>
        <Progress value={50} aria-label="Upload" />
        <Progress aria-label="Loading" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ProgressCircle', () => {
  it('renders an svg progressbar with clamped aria-valuenow', () => {
    const { rerender } = render(<ProgressCircle value={72} aria-label="Storage" />);
    const ring = screen.getByRole('progressbar', { name: 'Storage' });
    expect(ring.tagName).toBe('svg');
    expect(ring).toHaveAttribute('aria-valuenow', '72');
    expect(ring).toHaveAttribute('width', '36');
    rerender(<ProgressCircle value={120} aria-label="Storage" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<ProgressCircle value={-1} aria-label="Storage" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('supports preset and numeric sizes + tone', () => {
    const { rerender } = render(<ProgressCircle value={1} size="sm" aria-label="s" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('width', '24');
    rerender(<ProgressCircle value={1} size={64} tone="success" aria-label="s" />);
    const ring = screen.getByRole('progressbar');
    expect(ring).toHaveAttribute('width', '64');
    expect(ring.querySelectorAll('circle')[1]).toHaveClass('stroke-success');
  });

  it('spins when indeterminate and marks motion-keep', () => {
    render(<ProgressCircle aria-label="Loading" />);
    const ring = screen.getByRole('progressbar');
    expect(ring).not.toHaveAttribute('aria-valuenow');
    expect(ring).toHaveClass('animate-spin');
    expect(ring).toHaveAttribute('data-motion-keep', '');
  });

  it('forwards ref and merges className', () => {
    const ref = createRef<SVGSVGElement>();
    render(<ProgressCircle ref={ref} value={5} aria-label="r" className="ml-2" />);
    expect(ref.current?.tagName).toBe('svg');
    expect(ref.current).toHaveClass('ml-2', 'shrink-0');
  });

  it('is axe-clean', async () => {
    const { container } = render(<ProgressCircle value={30} aria-label="Storage" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
