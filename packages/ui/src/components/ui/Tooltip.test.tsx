import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Tooltip, TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from './Tooltip';

function Demo(props: { disabled?: boolean; side?: 'top' | 'right' | 'bottom' | 'left' }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip label="Copy link" disabled={props.disabled} side={props.side}>
        <button type="button">Copy</button>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('renders only the trigger while closed', () => {
    render(<Demo />);
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('opens on focus, describes the trigger via aria-describedby, closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Copy' });
    expect(trigger).toHaveFocus();
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('Copy link');
    expect(trigger).toHaveAttribute('aria-describedby', tip.id);
    expect(trigger).toHaveAccessibleDescription('Copy link');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(trigger).not.toHaveAttribute('aria-describedby');
    expect(trigger).toHaveFocus();
  });

  it('opens on hover and passes side to the content', async () => {
    const user = userEvent.setup();
    render(<Demo side="right" />);
    await user.hover(screen.getByRole('button', { name: 'Copy' }));
    await screen.findByRole('tooltip');
    const content = document.querySelector('[data-side]');
    expect(content).toHaveAttribute('data-side', 'right');
  });

  it('disabled renders the child without any tooltip wiring', async () => {
    const user = userEvent.setup();
    render(<Demo disabled />);
    const trigger = screen.getByRole('button', { name: 'Copy' });
    expect(trigger).not.toHaveAttribute('data-state');
    await user.tab();
    await user.hover(trigger);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('composable API: TooltipContent forwards ref, merges className, spreads props', async () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <TooltipProvider delayDuration={0}>
        <TooltipRoot defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent ref={ref} className="max-w-sm" data-testid="tc">
            Hello
          </TooltipContent>
        </TooltipRoot>
      </TooltipProvider>,
    );
    await screen.findByRole('tooltip');
    expect(ref.current).toHaveAttribute('data-testid', 'tc');
    expect(ref.current).toHaveClass('max-w-sm', 'rounded-md', 'bg-tooltip');
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Demo />);
    // `region` is a page-level rule; portals land directly in <body>.
    const opts = { rules: { region: { enabled: false } } };
    expect(await axe(baseElement, opts)).toHaveNoViolations();
    await user.tab();
    await screen.findByRole('tooltip');
    expect(await axe(baseElement, opts)).toHaveNoViolations();
  });
});
