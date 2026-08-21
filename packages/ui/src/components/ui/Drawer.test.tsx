import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './Drawer';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

// vaul captures the pointer on press; jsdom only ships has/releasePointerCapture.
if (!Element.prototype.setPointerCapture) Element.prototype.setPointerCapture = () => {};

const axeBody = () => axe(document.body, { rules: { region: { enabled: false } } });
// vaul injects exit keyframes, so Radix Presence keeps the content mounted
// until `animationend` — which jsdom never fires. Dispatch it ourselves.
const closed = async () => {
  for (const el of document.querySelectorAll(
    '[data-state="closed"][data-vaul-drawer], [data-state="closed"][data-vaul-overlay]',
  )) {
    const ev = new Event('animationend', { bubbles: true });
    Object.defineProperty(ev, 'animationName', {
      value: getComputedStyle(el).animationName,
    });
    fireEvent(el, ev);
  }
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
};

function Demo({
  direction,
  contentDirection,
  hideHandle,
  showClose,
  open,
  onOpenChange,
}: {
  direction?: 'top' | 'right' | 'bottom' | 'left';
  contentDirection?: 'top' | 'right' | 'bottom' | 'left';
  hideHandle?: boolean;
  showClose?: boolean;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  return (
    <Drawer direction={direction} open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent
        direction={contentDirection}
        hideHandle={hideHandle}
        showClose={showClose}
        className="extra"
      >
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Narrow the list.</DrawerDescription>
        </DrawerHeader>
        <input aria-label="Query" />
        <DrawerFooter>
          <DrawerClose>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('is closed by default and opens from the trigger with title/description wiring', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog', { name: 'Filters' });
    expect(dialog).toHaveAccessibleDescription('Narrow the list.');
    expect(dialog).toHaveClass('extra');
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('defaults to bottom placement with a drag handle', async () => {
    render(<Demo open />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('bottom-0', 'rounded-t-xl');
    expect(dialog.querySelector('[aria-hidden].h-1\\.5')).not.toBeNull();
  });

  it.each([
    ['right', 'right-0', 'rounded-l-xl'],
    ['left', 'left-0', 'rounded-r-xl'],
    ['top', 'top-0', 'rounded-b-xl'],
  ] as const)('direction=%s on <Drawer> is applied to the content', async (dir, a, b) => {
    render(<Demo open direction={dir} />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass(a, b);
    if (dir === 'right' || dir === 'left') expect(dialog).toHaveClass('flex-row');
  });

  it('DrawerContent direction prop overrides the root direction for placement', async () => {
    render(<Demo open direction="bottom" contentDirection="right" />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('right-0');
    expect(dialog).not.toHaveClass('bottom-0');
  });

  it('hideHandle and showClose={false}', async () => {
    render(<Demo open hideHandle showClose={false} />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.querySelector('[aria-hidden].h-1\\.5')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('Escape closes and focus returns to the trigger', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await closed();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('returnFocusTo moves focus to the given element on close', async () => {
    const user = userEvent.setup();
    const target = createRef<HTMLButtonElement>();
    render(
      <>
        <button ref={target} type="button">
          Target
        </button>
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent aria-describedby={undefined} returnFocusTo={target}>
            <DrawerTitle>T</DrawerTitle>
          </DrawerContent>
        </Drawer>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await closed();
    await waitFor(() => expect(target.current).toHaveFocus());
  });

  it('DrawerClose and the × button close it', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: 'Done' }));
    await closed();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await closed();
  });

  it('controlled: open drives visibility, onOpenChange(false) on Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Demo open onOpenChange={onOpenChange} />);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('forwards refs to content / title and merges sub-component classNames', async () => {
    const contentRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    render(
      <Drawer open>
        <DrawerContent ref={contentRef}>
          <DrawerHeader className="h-x" data-testid="hdr">
            <DrawerTitle ref={titleRef} className="t-x">
              T
            </DrawerTitle>
            <DrawerDescription className="d-x">D</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="f-x" data-testid="ftr" />
        </DrawerContent>
      </Drawer>,
    );
    const dialog = await screen.findByRole('dialog');
    expect(contentRef.current).toBe(dialog);
    expect(titleRef.current).toHaveClass('t-x', 'font-semibold');
    expect(screen.getByText('D')).toHaveClass('d-x');
    expect(screen.getByTestId('hdr')).toHaveClass('h-x', 'p-4');
    expect(screen.getByTestId('ftr')).toHaveClass('f-x', 'mt-auto');
  });

  it('localises the close label', async () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Demo open />
      </DesignSystemProvider>,
    );
    expect(await screen.findByRole('button', { name: 'Хаах' })).toBeInTheDocument();
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    expect(await axeBody()).toHaveNoViolations();
  });
});
