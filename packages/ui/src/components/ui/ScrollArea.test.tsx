import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ScrollArea, ScrollBar } from './ScrollArea';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('ScrollArea', () => {
  it('renders children inside a viewport and a corner', () => {
    const { container } = render(
      <ScrollArea className="h-64" data-testid="sa">
        <p>Long content</p>
      </ScrollArea>,
    );
    const root = screen.getByTestId('sa');
    expect(root).toBe(container.firstElementChild);
    expect(root).toHaveClass('relative', 'overflow-hidden', 'h-64');
    const viewport = root.querySelector('[data-radix-scroll-area-viewport]');
    expect(viewport).not.toBeNull();
    expect(viewport).toHaveClass('h-full', 'w-full');
    expect(viewport).toContainElement(screen.getByText('Long content'));
  });

  it('forwards ref to the root and spreads props', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref} dir="ltr" data-testid="sa">
        x
      </ScrollArea>,
    );
    expect(ref.current).toBe(screen.getByTestId('sa'));
    expect(ref.current).toHaveAttribute('dir', 'ltr');
  });

  it('type="always" renders the vertical scrollbar with its classes', () => {
    const { container } = render(
      <ScrollArea type="always">
        <div style={{ height: 1000 }}>x</div>
      </ScrollArea>,
    );
    const bar = container.querySelector('[data-orientation="vertical"]');
    expect(bar).not.toBeNull();
    expect(bar).toHaveClass('w-2', 'border-l');
  });

  it('ScrollBar horizontal orientation forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ScrollArea type="always">
        <div style={{ width: 2000 }}>x</div>
        <ScrollBar ref={ref} orientation="horizontal" className="h-3" />
      </ScrollArea>,
    );
    const bar = container.querySelector('[data-orientation="horizontal"]');
    expect(bar).not.toBeNull();
    expect(ref.current).toBe(bar);
    expect(bar).toHaveClass('h-3', 'flex-col', 'border-t');
  });

  it('viewport is a focusable, named group with a visible focus ring', () => {
    const { rerender } = render(
      <ScrollArea data-testid="sa">
        <p>Long content</p>
      </ScrollArea>,
    );
    const viewport = screen.getByTestId('sa').querySelector('[data-radix-scroll-area-viewport]')!;
    expect(viewport).toHaveAttribute('tabindex', '0');
    expect(viewport).toHaveAttribute('role', 'group');
    expect(viewport).toHaveAccessibleName('Scrollable content');
    expect(viewport).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-offset-2');

    rerender(
      <ScrollArea data-testid="sa" viewportLabel="Sidebar">
        <p>Long content</p>
      </ScrollArea>,
    );
    expect(viewport).toHaveAccessibleName('Sidebar');

    rerender(
      <DesignSystemProvider strings={mnStrings}>
        <ScrollArea data-testid="sa">
          <p>Long content</p>
        </ScrollArea>
      </DesignSystemProvider>,
    );
    expect(
      screen.getByTestId('sa').querySelector('[data-radix-scroll-area-viewport]'),
    ).toHaveAccessibleName(mnStrings.scrollArea.region);
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <ScrollArea className="h-32" type="always">
        <ul>
          <li>One</li>
          <li>Two</li>
        </ul>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
