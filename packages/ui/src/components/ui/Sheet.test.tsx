import { describe, expect, it, vi } from 'vitest';
import { createRef, useRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './Sheet';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

function Demo(props: {
  side?: 'top' | 'bottom' | 'left' | 'right';
  showClose?: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <Sheet defaultOpen={props.defaultOpen}>
      <SheetTrigger>Filters</SheetTrigger>
      <SheetContent side={props.side} showClose={props.showClose}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the result set.</SheetDescription>
        </SheetHeader>
        <input aria-label="Query" />
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
          <button type="button">Apply</button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('is closed by default and opens on trigger click as a modal dialog', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const dialog = await screen.findByRole('dialog', { name: 'Filters' });
    expect(dialog).toHaveAccessibleDescription('Refine the result set.');
    expect(dialog).toHaveClass('right-0', 'border-l');
    expect(dialog).toHaveAttribute('data-state', 'open');
  });

  it.each([
    ['top', 'top-0 border-b'],
    ['bottom', 'bottom-0 border-t'],
    ['left', 'left-0 border-r'],
    ['right', 'right-0 border-l'],
  ] as const)('side=%s applies its placement classes', async (side, classes) => {
    render(<Demo side={side} defaultOpen />);
    expect(await screen.findByRole('dialog')).toHaveClass(...classes.split(' '));
  });

  it('traps focus inside and returns it to the trigger on Escape', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    // Tab cycles within the dialog only.
    const focusables = [
      screen.getByLabelText('Query'),
      screen.getByRole('button', { name: 'Cancel' }),
      screen.getByRole('button', { name: 'Apply' }),
      screen.getByRole('button', { name: 'Close' }),
    ];
    for (let i = 0; i < focusables.length + 2; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('SheetClose and the built-in close button both dismiss', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Demo defaultOpen />);
    await user.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    unmount();
    render(<Demo defaultOpen />);
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('showClose={false} hides the built-in close button', async () => {
    render(<Demo defaultOpen showClose={false} />);
    await screen.findByRole('dialog');
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('controlled open/onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Sheet
          open={open}
          onOpenChange={(o) => {
            onOpenChange(o);
            setOpen(o);
          }}
        >
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent aria-describedby={undefined}>
            <SheetTitle>T</SheetTitle>
          </SheetContent>
        </Sheet>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('returnFocusTo moves focus to the given element on close (controlled, no trigger)', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      const burger = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button
            ref={burger}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpen(true)}
          >
            Burger
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent aria-describedby={undefined} returnFocusTo={burger}>
              <SheetTitle>Nav</SheetTitle>
            </SheetContent>
          </Sheet>
        </>
      );
    }
    render(<Controlled />);
    const burger = screen.getByRole('button', { name: 'Burger' });
    await user.click(burger);
    await screen.findByRole('dialog');
    expect(burger).not.toHaveFocus();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(burger).toHaveFocus();
  });

  it('a consumer onCloseAutoFocus that calls preventDefault wins over returnFocusTo', async () => {
    const user = userEvent.setup();
    const target = createRef<HTMLButtonElement>();
    const onCloseAutoFocus = vi.fn((e: Event) => e.preventDefault());
    render(
      <>
        <button ref={target} type="button">
          Target
        </button>
        <Sheet defaultOpen>
          <SheetContent
            aria-describedby={undefined}
            returnFocusTo={target}
            onCloseAutoFocus={onCloseAutoFocus}
          >
            <SheetTitle>T</SheetTitle>
          </SheetContent>
        </Sheet>
      </>,
    );
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
    expect(target.current).not.toHaveFocus();
  });

  it('uses the Mongolian close label from the provider', async () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Demo defaultOpen />
      </DesignSystemProvider>,
    );
    expect(await screen.findByRole('button', { name: 'Хаах' })).toBeInTheDocument();
  });

  it('forwards refs, merges className, spreads props', async () => {
    const contentRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const descRef = createRef<HTMLParagraphElement>();
    render(
      <Sheet defaultOpen>
        <SheetContent ref={contentRef} className="w-full" data-testid="sc">
          <SheetHeader className="gap-2" data-testid="sh">
            <SheetTitle ref={titleRef} className="text-xl">
              T
            </SheetTitle>
            <SheetDescription ref={descRef} className="italic">
              D
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="pt-0" data-testid="sf" />
        </SheetContent>
      </Sheet>,
    );
    const dialog = await screen.findByRole('dialog');
    expect(contentRef.current).toBe(dialog);
    expect(dialog).toHaveClass('w-full', 'fixed');
    expect(dialog).toHaveAttribute('data-testid', 'sc');
    expect(titleRef.current?.tagName).toBe('H2');
    expect(titleRef.current).toHaveClass('text-xl', 'font-semibold');
    expect(descRef.current?.tagName).toBe('P');
    expect(descRef.current).toHaveClass('italic', 'text-sm');
    expect(screen.getByTestId('sh')).toHaveClass('gap-2', 'flex-col');
    expect(screen.getByTestId('sf')).toHaveClass('pt-0', 'mt-auto');
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Demo />);
    expect(await axe(baseElement)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await screen.findByRole('dialog');
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
