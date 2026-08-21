import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Separator } from './Separator';

describe('Separator', () => {
  it('is decorative by default (role=none) and horizontal', () => {
    const { container } = render(<Separator />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('role', 'none');
    expect(el).toHaveAttribute('data-orientation', 'horizontal');
    expect(el).toHaveClass('h-px', 'w-full', 'bg-border');
  });

  it('exposes role=separator + aria-orientation when semantic and vertical', () => {
    const { container } = render(<Separator decorative={false} orientation="vertical" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveAttribute('role', 'separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
    expect(el).toHaveClass('h-full', 'w-px');
  });

  it('forwards ref, merges className and spreads unknown props', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Separator ref={ref} className="my-6" data-testid="sep" />);
    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveClass('my-6', 'bg-border');
    expect(ref.current).toHaveAttribute('data-testid', 'sep');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <div>
        <Separator />
        <Separator decorative={false} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
