import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './ContextMenu';

const axeBody = () => axe(document.body, { rules: { region: { enabled: false } } });

function Demo({
  onOpen = () => {},
  onDelete = () => {},
  onOpenChange,
}: {
  onOpen?: () => void;
  onDelete?: () => void;
  onOpenChange?: (o: boolean) => void;
}) {
  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger asChild>
        <div data-testid="zone">Right-click me</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="extra">
        <ContextMenuLabel>File</ContextMenuLabel>
        <ContextMenuItem onSelect={onOpen}>
          Open<ContextMenuShortcut>⌘O</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>Rename</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive onSelect={onDelete}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

describe('ContextMenu', () => {
  it('is closed by default and opens on contextmenu', async () => {
    render(<Demo />);
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.contextMenu(screen.getByTestId('zone'));
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveClass('extra', 'min-w-[12rem]');
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('text-danger-text');
    expect(screen.getByText('⌘O')).toHaveClass('ml-auto');
  });

  it('reports open state and selecting an item fires onSelect + closes', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onOpenChange = vi.fn();
    render(<Demo onOpen={onOpen} onOpenChange={onOpenChange} />);
    fireEvent.contextMenu(screen.getByTestId('zone'));
    await screen.findByRole('menu');
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole('menuitem', { name: /Open/ }));
    expect(onOpen).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('keyboard: arrows skip disabled items, Enter selects, Escape closes', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Demo onDelete={onDelete} />);
    fireEvent.contextMenu(screen.getByTestId('zone'));
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Open/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onDelete).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());

    fireEvent.contextMenu(screen.getByTestId('zone'));
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('checkbox and radio items', async () => {
    const user = userEvent.setup();
    function Demo2() {
      const [show, setShow] = useState(false);
      const [size, setSize] = useState('md');
      return (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div data-testid="zone">z</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem checked={show} onCheckedChange={setShow}>
              Show grid
            </ContextMenuCheckboxItem>
            <ContextMenuRadioGroup value={size} onValueChange={setSize}>
              <ContextMenuRadioItem value="sm">Small</ContextMenuRadioItem>
              <ContextMenuRadioItem value="md">Medium</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      );
    }
    render(<Demo2 />);
    fireEvent.contextMenu(screen.getByTestId('zone'));
    const check = await screen.findByRole('menuitemcheckbox', { name: 'Show grid' });
    expect(check).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('menuitemradio', { name: 'Medium' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.click(check);
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    fireEvent.contextMenu(screen.getByTestId('zone'));
    expect(await screen.findByRole('menuitemcheckbox', { name: 'Show grid' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await user.click(screen.getByRole('menuitemradio', { name: 'Small' }));
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    fireEvent.contextMenu(screen.getByTestId('zone'));
    expect(await screen.findByRole('menuitemradio', { name: 'Small' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('submenu opens with ArrowRight from its trigger', async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div data-testid="zone">z</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Email</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId('zone'));
    const sub = await screen.findByRole('menuitem', { name: 'Share' });
    expect(sub).toHaveClass('pl-8');
    await user.keyboard('{ArrowDown}');
    expect(sub).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(await screen.findByRole('menuitem', { name: 'Email' })).toBeInTheDocument();
  });

  it('sizes an icon passed as a child to 16px unless the svg sets its own size', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div data-testid="zone">Right-click me</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <svg data-testid="icon" aria-hidden />
            Item
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId('zone'));
    const item = await screen.findByRole('menuitem');
    expect(item).toHaveClass("[&_svg:not([class*='size-'])]:size-4", '[&_svg]:shrink-0');
    expect(item).toContainElement(screen.getByTestId('icon'));
  });

  it('forwards refs to content and item', async () => {
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    render(
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div data-testid="zone">z</div>
        </ContextMenuTrigger>
        <ContextMenuContent ref={contentRef}>
          <ContextMenuItem ref={itemRef} inset>
            Item
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId('zone'));
    expect(contentRef.current).toBe(await screen.findByRole('menu'));
    expect(itemRef.current).toBe(screen.getByRole('menuitem'));
    expect(itemRef.current).toHaveClass('pl-8');
  });

  it('is axe-clean closed and open', async () => {
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
    fireEvent.contextMenu(screen.getByTestId('zone'));
    await screen.findByRole('menu');
    expect(await axeBody()).toHaveNoViolations();
  });
});
