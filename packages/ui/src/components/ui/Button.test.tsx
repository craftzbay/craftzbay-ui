import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to type="button" and honours an explicit type', () => {
    const { rerender } = render(<Button>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    rerender(<Button type="submit">Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('applies variant and size classes', () => {
    const { rerender } = render(<Button>x</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-accent', 'h-9');
    rerender(
      <Button variant="destructive" size="lg">
        x
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('bg-danger', 'h-10');
    rerender(
      <Button variant="link" size="sm">
        x
      </Button>,
    );
    // link ignores horizontal padding / height from size
    expect(screen.getByRole('button')).toHaveClass('h-auto', 'px-0');
    rerender(<Button size="icon">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-9');
  });

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('activates from the keyboard with Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('is aria-disabled (not disabled) when `loading`', () => {
    render(<Button loading>Saving…</Button>);
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');
  });

  it('loading keeps focus but blocks click and shows a spinner instead of icons', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <Button
        loading
        onClick={onClick}
        leadingIcon={<svg data-testid="lead" />}
        trailingIcon={<svg data-testid="trail" />}
      >
        Save
      </Button>,
    );
    const btn = screen.getByRole('button');
    btn.focus();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(btn).toHaveFocus();
    expect(screen.queryByTestId('lead')).toBeNull();
    expect(screen.queryByTestId('trail')).toBeNull();
    expect(container.querySelector('.animate-spin')).not.toBeNull();
  });

  it('renders leading and trailing icons when not loading', () => {
    render(
      <Button leadingIcon={<svg data-testid="lead" />} trailingIcon={<svg data-testid="trail" />}>
        Save
      </Button>,
    );
    expect(screen.getByTestId('lead')).toBeInTheDocument();
    expect(screen.getByTestId('trail')).toBeInTheDocument();
  });

  it('respects the `disabled` prop', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Off
      </Button>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders an anchor when asChild with merged className, props and ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button asChild ref={ref} className="extra" data-x="1">
        <a href="/x">Link</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toHaveAttribute('href', '/x');
    expect(link).toHaveClass('extra', 'bg-accent');
    expect(link).toHaveAttribute('data-x', '1');
    expect(ref.current).toBe(link);
    expect(link).not.toHaveAttribute('type');
  });

  it('asChild + loading marks the child busy and blocks its click / Enter', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button asChild loading>
        <a href="/x" onClick={onClick}>
          Link
        </a>
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-busy', 'true');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    await user.click(link);
    link.focus();
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the native button and spreads unknown props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} data-testid="b" name="action">
        x
      </Button>,
    );
    expect(ref.current).toBe(screen.getByTestId('b'));
    expect(ref.current).toHaveAttribute('name', 'action');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Button>Primary</Button>
        <Button variant="outline">Secondary</Button>
        <Button disabled>Off</Button>
        <Button loading>Busy</Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
