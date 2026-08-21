import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Snackbar } from './Snackbar';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('Snackbar', () => {
  it('renders role=status with title, body, and default border', () => {
    render(<Snackbar title="Saved">Your changes are live.</Snackbar>);
    const el = screen.getByRole('status');
    expect(el).toHaveTextContent('Saved');
    expect(el).toHaveTextContent('Your changes are live.');
    expect(el).toHaveClass('border-border');
    // default variant has no icon
    expect(el.querySelector('svg')).toBeNull();
  });

  it.each([
    ['info', 'border-info-border-soft'],
    ['success', 'border-success-border-soft'],
    ['warning', 'border-warning-border-soft'],
    ['danger', 'border-danger-border-soft'],
  ] as const)('variant %s applies its border and icon', (variant, cls) => {
    render(<Snackbar variant={variant} title="t" />);
    const el = screen.getByRole('status');
    expect(el).toHaveClass(cls);
    expect(el.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('icon={false} hides the variant icon; custom icon replaces it', () => {
    const { rerender } = render(<Snackbar variant="info" icon={false} title="t" />);
    expect(screen.getByRole('status').querySelector('svg')).toBeNull();
    rerender(<Snackbar variant="info" icon={<span data-testid="custom" />} title="t" />);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('renders action and a dismiss button wired to onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Snackbar title="Archived" action={<button type="button">Undo</button>} onClose={onClose} />,
    );
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('omits the dismiss button without onClose', () => {
    render(<Snackbar title="t" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Snackbar ref={ref} className="mt-2" data-testid="sb" title="t" />);
    expect(ref.current).toBe(screen.getByRole('status'));
    expect(ref.current).toHaveClass('mt-2', 'rounded-md');
    expect(ref.current).toHaveAttribute('data-testid', 'sb');
  });

  it('uses the Mongolian dismiss label', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Snackbar title="t" onClose={() => {}} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: 'Хаах' })).toBeInTheDocument();
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <Snackbar variant="success" title="Saved" onClose={() => {}}>
        Done.
      </Snackbar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
