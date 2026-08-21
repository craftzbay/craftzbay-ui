import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

describe('EmptyState', () => {
  it('renders title as h3 by default with the built-in illustration', () => {
    const { container } = render(<EmptyState title="No projects yet" />);
    expect(screen.getByRole('heading', { level: 3, name: 'No projects yet' })).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('honours headingLevel and renders description', () => {
    render(<EmptyState title="T" description="Create one to start." headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('T');
    expect(screen.getByText('Create one to start.')).toBeInTheDocument();
  });

  it('icon renders inside the 48px container; illustration replaces it', () => {
    const { container, rerender } = render(
      <EmptyState title="T" icon={<svg data-testid="ico" />} />,
    );
    expect(screen.getByTestId('ico').parentElement).toHaveClass('size-12', 'rounded-full');
    rerender(
      <EmptyState
        title="T"
        icon={<svg data-testid="ico" />}
        illustration={<svg data-testid="ill" />}
      />,
    );
    expect(screen.getByTestId('ill')).toBeInTheDocument();
    expect(screen.queryByTestId('ico')).toBeNull();
    expect(container.querySelector('.size-12')).toBeNull();
  });

  it('renders action and secondaryAction in a row; omits the row otherwise', () => {
    const { container, rerender } = render(<EmptyState title="T" />);
    expect(container.querySelector('.mt-2')).toBeNull();
    rerender(
      <EmptyState
        title="T"
        action={<Button>New project</Button>}
        secondaryAction={<a href="/docs">Learn more</a>}
      />,
    );
    expect(screen.getByRole('button', { name: 'New project' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
  });

  it('forwards ref, merges className and spreads props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="T" className="extra" data-testid="es" />);
    expect(ref.current).toBe(screen.getByTestId('es'));
    expect(ref.current).toHaveClass('extra', 'border-dashed');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <EmptyState
        title="No projects yet"
        description="Create a project to start tracking work."
        action={<Button>New project</Button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
