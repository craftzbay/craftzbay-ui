import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders a <kbd> element with its children', () => {
    render(<Kbd>⌘</Kbd>);
    const el = screen.getByText('⌘');
    expect(el.tagName).toBe('KBD');
    expect(el).toHaveClass('font-mono');
  });

  it('applies size classes (sm default, md)', () => {
    const { rerender } = render(<Kbd>K</Kbd>);
    expect(screen.getByText('K')).toHaveClass('h-5');
    rerender(<Kbd size="md">K</Kbd>);
    expect(screen.getByText('K')).toHaveClass('h-6');
  });

  it('forwards ref, merges className and spreads props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Kbd ref={ref} className="extra" data-testid="k" title="Command">
        ⌘
      </Kbd>,
    );
    expect(ref.current).toBe(screen.getByTestId('k'));
    expect(ref.current).toHaveClass('extra', 'border');
    expect(ref.current).toHaveAttribute('title', 'Command');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <p>
        Press <Kbd>⌘</Kbd>+<Kbd>K</Kbd>
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
