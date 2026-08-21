import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { IconButton } from './IconButton';

const icon = <svg data-testid="ico" />;

describe('IconButton', () => {
  it('renders a labelled button with the icon and type=button', () => {
    render(<IconButton aria-label="Edit" icon={icon} />);
    const btn = screen.getByRole('button', { name: 'Edit' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(screen.getByTestId('ico')).toBeInTheDocument();
  });

  it('defaults to ghost / md and applies other variants + sizes', () => {
    const { rerender } = render(<IconButton aria-label="x" icon={icon} />);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent', 'h-9', 'w-9');
    rerender(<IconButton aria-label="x" icon={icon} variant="destructive" size="xl" />);
    expect(screen.getByRole('button')).toHaveClass('bg-danger', 'h-11', 'w-11');
  });

  it('fires onClick on click and Enter/Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton aria-label="x" icon={icon} onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('loading: aria-busy/aria-disabled, spinner replaces icon, click blocked, focus kept', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <IconButton aria-label="x" icon={icon} loading onClick={onClick} />,
    );
    const btn = screen.getByRole('button');
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByTestId('ico')).toBeNull();
    expect(container.querySelector('.animate-spin')).not.toBeNull();
    btn.focus();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(btn).toHaveFocus();
  });

  it('disabled blocks clicks', async () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="x" icon={icon} disabled onClick={onClick} />);
    expect(screen.getByRole('button')).toBeDisabled();
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref, merges className and spreads props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} aria-label="x" icon={icon} className="extra" data-testid="b" />);
    expect(ref.current).toBe(screen.getByTestId('b'));
    expect(ref.current).toHaveClass('extra', 'rounded-md');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <div>
        <IconButton aria-label="Edit" icon={icon} />
        <IconButton aria-label="Busy" icon={icon} loading />
        <IconButton aria-label="Off" icon={icon} disabled variant="primary" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
