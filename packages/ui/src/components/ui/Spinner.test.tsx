import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Spinner } from './Spinner';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('Spinner', () => {
  it('renders role=status with the default label and reduced-motion marker', () => {
    render(<Spinner />);
    const el = screen.getByRole('status');
    expect(el.tagName).toBe('svg');
    expect(el).toHaveAttribute('aria-label', 'Loading');
    expect(el).toHaveAttribute('data-motion-keep', '');
    expect(el).toHaveClass('animate-spin', 'size-4', 'text-accent');
  });

  it('applies size and tone classes', () => {
    render(<Spinner size="lg" tone="neutral" label="Saving" />);
    const el = screen.getByRole('status', { name: 'Saving' });
    expect(el).toHaveClass('size-6', 'text-foreground-subtle');
  });

  it('decorative hides it from AT', () => {
    const { container } = render(<Spinner decorative />);
    expect(screen.queryByRole('status')).toBeNull();
    const el = container.querySelector('svg') as SVGElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).not.toHaveAttribute('aria-label');
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<SVGSVGElement>();
    render(<Spinner ref={ref} className="mx-2" data-testid="sp" />);
    expect(ref.current?.tagName).toBe('svg');
    expect(ref.current).toHaveClass('mx-2', 'animate-spin');
    expect(ref.current).toHaveAttribute('data-testid', 'sp');
  });

  it('uses Mongolian label from the provider', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Spinner />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Ачаалж байна');
  });

  it('is axe-clean', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
