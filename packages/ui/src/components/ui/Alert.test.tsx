import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Alert } from './Alert';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('Alert', () => {
  it('has no live-region role by default', () => {
    render(<Alert title="Saved">All changes published.</Alert>);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('uses role="status" for live non-danger variants', () => {
    render(
      <Alert live title="Saved">
        All changes published.
      </Alert>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses role="alert" for live danger', () => {
    render(
      <Alert live variant="danger" title="Failed">
        Card declined.
      </Alert>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders title and body', () => {
    render(<Alert title="Saved">All changes published.</Alert>);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('All changes published.')).toBeInTheDocument();
  });

  it('applies variant classes and the default heading level', () => {
    const { rerender } = render(
      <Alert title="T" data-testid="a">
        body
      </Alert>,
    );
    expect(screen.getByTestId('a')).toHaveClass('bg-background-subtle');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('T');
    rerender(
      <Alert title="T" variant="danger" headingLevel={2} data-testid="a">
        body
      </Alert>,
    );
    expect(screen.getByTestId('a')).toHaveClass('bg-danger-soft');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('T');
  });

  it('renders the variant icon, a custom icon, or none with icon={false}', () => {
    const { container, rerender } = render(<Alert variant="info">x</Alert>);
    expect(container.querySelector('svg')).not.toBeNull();
    rerender(
      <Alert variant="info" icon={false}>
        x
      </Alert>,
    );
    expect(container.querySelector('svg')).toBeNull();
    rerender(
      <Alert variant="info" icon={<span data-testid="custom" />}>
        x
      </Alert>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('uncontrolled: dismiss hides the alert and calls onDismiss / onOpenChange(false)', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Alert dismissible onDismiss={onDismiss} onOpenChange={onOpenChange} title="Hi">
        body
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText('Hi')).toBeNull();
  });

  it('controlled: `open` wins — stays visible after dismiss until the parent updates', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Alert dismissible open onOpenChange={onOpenChange} title="Hi">
        body
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText('Hi')).toBeInTheDocument();
    rerender(
      <Alert dismissible open={false} onOpenChange={onOpenChange} title="Hi">
        body
      </Alert>,
    );
    expect(screen.queryByText('Hi')).toBeNull();
  });

  it('dismiss button is keyboard operable', async () => {
    const user = userEvent.setup();
    render(
      <Alert dismissible title="Hi">
        body
      </Alert>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.queryByText('Hi')).toBeNull();
  });

  it('forwards ref, merges className and spreads unknown props', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} className="extra" data-testid="root" id="alert-1">
        body
      </Alert>,
    );
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current).toHaveClass('extra', 'rounded-lg');
    expect(ref.current).toHaveAttribute('id', 'alert-1');
  });

  it('uses Mongolian strings for the dismiss label', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Alert dismissible>body</Alert>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: 'Хаах' })).toBeInTheDocument();
  });

  it('all variants pass axe', async () => {
    const { container } = render(
      <div>
        <Alert variant="info" title="Info" dismissible>
          Heads up.
        </Alert>
        <Alert variant="success" title="Success">
          Saved.
        </Alert>
        <Alert variant="warning" title="Warn">
          Quota.
        </Alert>
        <Alert variant="danger" title="Danger" live>
          Error.
        </Alert>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
