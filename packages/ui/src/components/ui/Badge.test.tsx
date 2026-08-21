import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies tone + variant compound classes', () => {
    const { rerender } = render(<Badge tone="success">ok</Badge>);
    expect(screen.getByText('ok')).toHaveClass('bg-success-soft', 'text-success-text');
    rerender(
      <Badge tone="danger" variant="outline">
        ok
      </Badge>,
    );
    expect(screen.getByText('ok')).toHaveClass('border-danger-border-soft', 'bg-transparent');
    expect(screen.getByText('ok')).not.toHaveClass('bg-danger-soft');
  });

  it('renders a tone-coloured dot that is hidden from AT', () => {
    const { container } = render(
      <Badge tone="warning" dot>
        Pending
      </Badge>,
    );
    const dot = container.querySelector('span[aria-hidden]');
    expect(dot).toHaveClass('bg-warning', 'rounded-full');
  });

  it('icon overrides dot and is aria-hidden', () => {
    const { container } = render(
      <Badge dot icon={<svg data-testid="ico" />}>
        x
      </Badge>,
    );
    expect(screen.getByTestId('ico')).toBeInTheDocument();
    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(1);
    expect(container.querySelector('.size-1\\.5')).toBeNull();
  });

  it('forwards ref, merges className and spreads props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="extra" data-testid="b" title="hint">
        x
      </Badge>,
    );
    expect(ref.current).toBe(screen.getByTestId('b'));
    expect(ref.current).toHaveClass('extra', 'rounded-full');
    expect(ref.current).toHaveAttribute('title', 'hint');
  });

  it('renders all tone variants with sufficient contrast', async () => {
    const { container } = render(
      <div>
        {(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const).map((t) => (
          <span key={t}>
            <Badge tone={t}>{t}</Badge>
            <Badge tone={t} variant="outline" dot>
              {t}
            </Badge>
          </span>
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
