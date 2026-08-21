import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Icon, iconNames } from './Icon';

describe('Icon', () => {
  it('exposes the lucide icon name list', () => {
    expect(iconNames).toContain('calendar');
    expect(iconNames.length).toBeGreaterThan(100);
  });

  it('renders a placeholder while loading, then the lazy SVG with passed props', async () => {
    const { container } = render(<Icon name="calendar" className="size-4" data-testid="ico" />);
    // Suspense fallback: invisible square, hidden from AT.
    const placeholder = container.querySelector('span[aria-hidden]');
    expect(placeholder).not.toBeNull();
    expect(placeholder).toHaveClass('size-4');
    const svg = await screen.findByTestId('ico');
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg).toHaveClass('size-4');
    expect(container.querySelector('span[aria-hidden]')).toBeNull();
  });

  it('uses a custom fallback while loading', async () => {
    render(<Icon name="rocket" fallback={<i data-testid="fb" />} data-testid="ico" />);
    expect(screen.getByTestId('fb')).toBeInTheDocument();
    await screen.findByTestId('ico');
    expect(screen.queryByTestId('fb')).toBeNull();
  });

  it('renders nothing and warns once for an unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container, rerender } = render(
      // @ts-expect-error — runtime guard for data-driven names
      <Icon name="not-a-real-icon" />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(warn).toHaveBeenCalledTimes(1);
    // @ts-expect-error same invalid name again
    rerender(<Icon name="not-a-real-icon" />);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('is axe-clean once loaded', async () => {
    const { container } = render(<Icon name="calendar" data-testid="ico" aria-hidden />);
    await screen.findByTestId('ico');
    expect(await axe(container)).toHaveNoViolations();
  });
});
