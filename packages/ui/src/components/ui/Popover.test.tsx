import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger } from './Popover';

function Demo(props: { defaultOpen?: boolean }) {
  return (
    <Popover defaultOpen={props.defaultOpen}>
      <PopoverTrigger>Options</PopoverTrigger>
      <PopoverContent aria-label="Options panel">
        <p>Body</p>
        <button type="button">Action</button>
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('is closed by default; trigger exposes expanded state', () => {
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Options' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens on click, renders in a portal, and closes via PopoverClose', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Options' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Options panel' });
    expect(dialog).toHaveAttribute('data-state', 'open');
    expect(dialog).toHaveClass('rounded-lg', 'border', 'min-w-72');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    await user.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('Escape closes and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Options' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('keyboard: Enter on the trigger opens, Tab reaches inner controls', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Options' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await screen.findByRole('dialog');
    // Radix auto-focuses the first tabbable inside the content.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus());
    await user.tab();
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus();
  });

  it('defaultOpen renders open (uncontrolled)', () => {
    render(<Demo defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('controlled open/onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Popover
          open={open}
          onOpenChange={(o) => {
            onOpenChange(o);
            setOpen(o);
          }}
        >
          <PopoverTrigger>Toggle</PopoverTrigger>
          <PopoverContent>Inside</PopoverContent>
        </Popover>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(await screen.findByRole('dialog')).toHaveTextContent('Inside');
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('supports PopoverAnchor as the positioning reference', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverAnchor>
          <span>Anchor</span>
        </PopoverAnchor>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('dialog')).toHaveTextContent('Content');
  });

  it('forwards ref, merges className, spreads props on PopoverContent', async () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent ref={ref} className="w-96" data-testid="pc" align="start" sideOffset={8}>
          X
        </PopoverContent>
      </Popover>,
    );
    const dialog = await screen.findByRole('dialog');
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass('w-96', 'rounded-lg');
    expect(dialog).toHaveAttribute('data-testid', 'pc');
    expect(dialog).toHaveAttribute('data-align', 'start');
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Demo />);
    expect(await axe(baseElement)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Options' }));
    await screen.findByRole('dialog');
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
