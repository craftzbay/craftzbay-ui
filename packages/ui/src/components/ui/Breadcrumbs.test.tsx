import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Breadcrumbs } from './Breadcrumbs';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const items = [
  { label: 'Projects', href: '/projects' },
  { label: 'Nova', href: '/projects/nova' },
  { label: 'Settings' },
];

describe('Breadcrumbs', () => {
  it('renders a nav with the default label, links, and aria-current on the last item', () => {
    render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'Nova' })).toHaveAttribute('href', '/projects/nova');
    const current = screen.getByText('Settings');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).toBe('SPAN');
  });

  it('last item is never a link even with href', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'A', href: '/a' },
          { label: 'B', href: '/b' },
        ]}
      />,
    );
    expect(screen.queryByRole('link', { name: 'B' })).toBeNull();
    expect(screen.getByText('B')).toHaveAttribute('aria-current', 'page');
  });

  it('non-last items without href render as plain spans', () => {
    render(<Breadcrumbs items={[{ label: 'Root' }, { label: 'Leaf' }]} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Root').tagName).toBe('SPAN');
  });

  it('consumer aria-label wins, default kept when undefined is passed', () => {
    const { rerender } = render(<Breadcrumbs items={items} aria-label="Trail" />);
    expect(screen.getByRole('navigation', { name: 'Trail' })).toBeInTheDocument();
    rerender(<Breadcrumbs items={items} aria-label={undefined} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('collapses to first + ellipsis + last two when items exceed maxItems', () => {
    const many = ['A', 'B', 'C', 'D', 'E', 'F'].map((l, i, arr) =>
      i === arr.length - 1 ? { label: l } : { label: l, href: `/${l}` },
    );
    render(<Breadcrumbs items={many} maxItems={4} />);
    expect(screen.getByRole('link', { name: 'A' })).toBeInTheDocument();
    expect(screen.queryByText('B')).toBeNull();
    expect(screen.queryByText('C')).toBeNull();
    expect(screen.queryByText('D')).toBeNull();
    expect(screen.getByRole('link', { name: 'E' })).toBeInTheDocument();
    expect(screen.getByText('F')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Hidden items')).toHaveClass('sr-only');
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('does not collapse when items.length equals maxItems', () => {
    render(<Breadcrumbs items={items} maxItems={3} />);
    expect(screen.queryByText('Hidden items')).toBeNull();
  });

  it('custom collapsedLabel overrides the default', () => {
    const many = ['A', 'B', 'C', 'D', 'E'].map((l) => ({ label: l, href: `/${l}` }));
    render(<Breadcrumbs items={many} maxItems={3} collapsedLabel="More" />);
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('uses renderLink for non-last items with href', () => {
    render(
      <Breadcrumbs
        items={items}
        renderLink={(href, children) => (
          <a href={href} data-custom="1">
            {children}
          </a>
        )}
      />,
    );
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('data-custom', '1');
    expect(screen.getByText('Settings')).not.toHaveAttribute('data-custom');
  });

  it('forwards ref, merges className and spreads props', () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumbs ref={ref} items={items} className="extra" data-testid="bc" />);
    expect(ref.current).toBe(screen.getByTestId('bc'));
    expect(ref.current).toHaveClass('extra', 'text-sm');
    expect(ref.current?.tagName).toBe('NAV');
  });

  it('localises the nav label and collapsed text', () => {
    const many = ['A', 'B', 'C', 'D', 'E'].map((l) => ({ label: l, href: `/${l}` }));
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Breadcrumbs items={many} maxItems={3} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Замчлал' })).toBeInTheDocument();
    expect(screen.getByText('Нуугдсан алхмууд')).toBeInTheDocument();
  });

  it('is axe-clean (plain and collapsed)', async () => {
    const many = ['A', 'B', 'C', 'D', 'E', 'F'].map((l) => ({ label: l, href: `/${l}` }));
    const { container } = render(
      <div>
        <Breadcrumbs items={items} />
        <Breadcrumbs items={many} aria-label="Long trail" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
