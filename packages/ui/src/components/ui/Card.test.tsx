import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

describe('Card', () => {
  it('renders a plain div with default variant + padding', () => {
    render(<Card data-testid="c">body</Card>);
    const c = screen.getByTestId('c');
    expect(c.tagName).toBe('DIV');
    expect(c).toHaveClass('border-border', 'p-4', 'md:p-6');
    expect(c).not.toHaveAttribute('role');
    expect(c).not.toHaveAttribute('tabindex');
  });

  it('applies padding and variant classes', () => {
    const { rerender } = render(
      <Card data-testid="c" padding="none">
        x
      </Card>,
    );
    expect(screen.getByTestId('c')).not.toHaveClass('p-4');
    rerender(
      <Card data-testid="c" padding="lg" variant="interactive">
        x
      </Card>,
    );
    expect(screen.getByTestId('c')).toHaveClass('p-6', 'cursor-pointer');
  });

  it('interactive + onClick becomes a keyboard-operable button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Card variant="interactive" onClick={onClick}>
        Row
      </Card>,
    );
    const btn = screen.getByRole('button', { name: 'Row' });
    expect(btn).toHaveAttribute('tabindex', '0');
    await user.tab();
    expect(btn).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('interactive without onClick is not a button', () => {
    render(
      <Card variant="interactive" data-testid="c">
        x
      </Card>,
    );
    expect(screen.getByTestId('c')).not.toHaveAttribute('role');
  });

  it('consumer role / tabIndex win over the button defaults', () => {
    render(
      <Card variant="interactive" onClick={() => {}} role="link" tabIndex={-1} data-testid="c">
        x
      </Card>,
    );
    expect(screen.getByTestId('c')).toHaveAttribute('role', 'link');
    expect(screen.getByTestId('c')).toHaveAttribute('tabindex', '-1');
  });

  it('does not hijack Enter/Space from nested controls', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Card variant="interactive" onClick={onClick}>
        <input aria-label="inner" />
      </Card>,
    );
    screen.getByLabelText('inner').focus();
    await user.keyboard('a b{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls consumer onKeyDown first and respects preventDefault', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onKeyDown = vi.fn((e: React.KeyboardEvent) => e.preventDefault());
    render(
      <Card variant="interactive" onClick={onClick} onKeyDown={onKeyDown}>
        x
      </Card>,
    );
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(onKeyDown).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('asChild renders the child element with merged props and ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card asChild ref={ref} className="extra">
        <a href="/p">Go</a>
      </Card>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveClass('extra', 'rounded-lg');
    expect(ref.current).toBe(link);
  });

  it('forwards ref and spreads props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref} id="card-1" className="extra" />);
    expect(ref.current).toHaveAttribute('id', 'card-1');
    expect(ref.current).toHaveClass('extra');
  });

  it('sub-components render the right elements and merge className', () => {
    const titleRef = createRef<HTMLHeadingElement>();
    render(
      <Card>
        <CardHeader className="h-x" data-testid="header">
          <CardTitle ref={titleRef} className="t-x">
            Storage
          </CardTitle>
          <CardDescription className="d-x">Usage</CardDescription>
        </CardHeader>
        <CardContent className="c-x" data-testid="content">
          body
        </CardContent>
        <CardFooter className="f-x" data-testid="footer">
          foot
        </CardFooter>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Storage' })).toBe(titleRef.current);
    expect(titleRef.current).toHaveClass('t-x', 'font-semibold');
    expect(screen.getByText('Usage').tagName).toBe('P');
    expect(screen.getByText('Usage')).toHaveClass('d-x');
    expect(screen.getByTestId('header')).toHaveClass('h-x', 'pb-4');
    expect(screen.getByTestId('content')).toHaveClass('c-x');
    expect(screen.getByTestId('footer')).toHaveClass('f-x', 'pt-4');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Desc</CardDescription>
          </CardHeader>
          <CardContent>Body</CardContent>
        </Card>
        <Card variant="interactive" onClick={() => {}}>
          Clickable
        </Card>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
