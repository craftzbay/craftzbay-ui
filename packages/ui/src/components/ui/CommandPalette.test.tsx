import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  useCommandPaletteShortcut,
} from './CommandPalette';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const axeBody = () => axe(document.body, { rules: { region: { enabled: false } } });

function Palette({ onCreate = () => {}, onInvite = () => {} }) {
  return (
    <>
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={onCreate}>
            Create project<CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onInvite}>Invite teammate</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem disabled>Billing</CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

function Shell({ initialOpen = false, title }: { initialOpen?: boolean; title?: string }) {
  const [open, setOpen] = useState(initialOpen);
  useCommandPaletteShortcut(setOpen);
  return (
    <>
      <span data-testid="state">{open ? 'open' : 'closed'}</span>
      <button type="button" onClick={() => setOpen(true)}>
        Launch
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title={title}>
        <Palette />
      </CommandDialog>
    </>
  );
}

describe('Command (inline)', () => {
  it('renders input, groups, items, shortcuts and merges classNames', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Command ref={ref} className="extra" label="Commands">
        <Palette />
      </Command>,
    );
    expect(ref.current).toHaveClass('extra', 'rounded-lg');
    expect(screen.getByPlaceholderText('Type a command…')).toBeInTheDocument();
    expect(screen.getByText('Suggestions')).toBeInTheDocument();
    expect(screen.getByText('⌘N')).toHaveClass('ml-auto');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'Billing' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.queryByText('No results.')).toBeNull();
  });

  it('filters by typing and shows the empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(
      <Command label="Commands">
        <Palette />
      </Command>,
    );
    await user.type(screen.getByPlaceholderText('Type a command…'), 'invite');
    expect(screen.getByRole('option', { name: 'Invite teammate' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Create project/ })).toBeNull();
    await user.clear(screen.getByPlaceholderText('Type a command…'));
    await user.type(screen.getByPlaceholderText('Type a command…'), 'zzz');
    expect(screen.getByText('No results.')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('keyboard: ArrowDown/Up move the selection, Enter selects', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onInvite = vi.fn();
    render(
      <Command label="Commands">
        <Palette onCreate={onCreate} onInvite={onInvite} />
      </Command>,
    );
    const input = screen.getByPlaceholderText('Type a command…');
    input.focus();
    await waitFor(() =>
      expect(screen.getByRole('option', { name: /Create project/ })).toHaveAttribute(
        'aria-selected',
        'true',
      ),
    );
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Invite teammate' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await user.keyboard('{Enter}');
    expect(onInvite).toHaveBeenCalledOnce();
    await user.keyboard('{ArrowUp}{Enter}');
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it('CommandList uses the default label and accepts an override', () => {
    const { rerender } = render(
      <Command label="Commands">
        <CommandList>
          <CommandItem>x</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(screen.getByRole('listbox', { name: 'Suggestions' })).toBeInTheDocument();
    rerender(
      <Command label="Commands">
        <CommandList label="Results">
          <CommandItem>x</CommandItem>
        </CommandList>
      </Command>,
    );
    expect(screen.getByRole('listbox', { name: 'Results' })).toBeInTheDocument();
  });

  it('localises the list label', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Command label="Commands">
          <CommandList>
            <CommandItem>x</CommandItem>
          </CommandList>
        </Command>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('listbox', { name: 'Санал болгох' })).toBeInTheDocument();
  });
});

describe('CommandDialog + useCommandPaletteShortcut', () => {
  it('is closed by default; ⌘K / Ctrl+K toggle it', async () => {
    const user = userEvent.setup();
    render(<Shell />);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.keyboard('{Meta>}k{/Meta}');
    expect(await screen.findByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    await user.keyboard('{Control>}k{/Control}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('Alt+⌘K is ignored', async () => {
    const user = userEvent.setup();
    render(<Shell />);
    await user.keyboard('{Meta>}{Alt>}k{/Alt}{/Meta}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('custom title is the dialog name (sr-only)', () => {
    render(<Shell initialOpen title="Jump to" />);
    const dialog = screen.getByRole('dialog', { name: 'Jump to' });
    expect(dialog).not.toHaveAttribute('aria-describedby');
    expect(screen.getByText('Jump to')).toHaveClass('sr-only');
  });

  it('focuses the input when opened; Escape closes and returns focus to the launcher', async () => {
    const user = userEvent.setup();
    render(<Shell />);
    const launch = screen.getByRole('button', { name: 'Launch' });
    await user.click(launch);
    await screen.findByRole('dialog');
    await waitFor(() => expect(screen.getByPlaceholderText('Type a command…')).toHaveFocus());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByTestId('state')).toHaveTextContent('closed');
    expect(launch).toHaveFocus();
  });

  it('localises the default dialog title', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <CommandDialog open onOpenChange={() => {}}>
          <Palette />
        </CommandDialog>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('dialog', { name: 'Командын самбар' })).toBeInTheDocument();
  });

  it('is axe-clean when open', async () => {
    render(<Shell initialOpen />);
    await screen.findByRole('dialog');
    expect(await axeBody()).toHaveNoViolations();
  });
});
