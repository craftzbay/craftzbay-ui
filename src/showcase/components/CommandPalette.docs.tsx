import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/CommandPalette';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'command-palette',
  name: 'CommandPalette',
  group: 'Overlays',
  description:
    '⌘K-style command surface. Use for app-wide search + jump-to + quick actions. CommandDialog wraps it in a modal; useCommandPaletteShortcut wires ⌘K / Ctrl+K.',
  exports: ['Command', 'CommandInput', 'CommandList', 'CommandEmpty', 'CommandGroup', 'CommandItem', 'CommandDialog', 'useCommandPaletteShortcut'],
  sourceFile: 'CommandPalette.tsx',
  examples: [
    {
      title: 'Inline',
      preview: (
        <Command className="w-full max-w-md rounded-md border border-border bg-card">
          <CommandInput placeholder="Type a command…" />
          <CommandList className="max-h-40">
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>New file</CommandItem>
              <CommandItem>Invite user</CommandItem>
              <CommandItem>Open settings</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Pages">
              <CommandItem>Dashboard</CommandItem>
              <CommandItem>Projects</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      ),
      code: `<Command>
  <CommandInput placeholder="Type a command…" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Actions">
      <CommandItem>New file</CommandItem>
      <CommandItem onSelect={() => setOpen(true)}>Invite user</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
    },
    {
      title: 'Modal (CommandDialog)',
      description: 'Mount once at the root and toggle from anywhere.',
      preview: (
        <div className="text-sm text-foreground-muted">
          Press <kbd className="rounded border border-border bg-background-muted px-1.5 py-0.5 text-xs">⌘ K</kbd> to open the showcase palette.
        </div>
      ),
      code: `const [open, setOpen] = useState(false);
useCommandPaletteShortcut(setOpen);

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command…" />
  <CommandList>…</CommandList>
</CommandDialog>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'CommandInput', type: 'component', description: 'Bound search input. Filters items by their `value` prop.' },
        { name: 'CommandItem.value', type: 'string', description: 'String used for type-ahead matching.' },
        { name: 'CommandItem.onSelect', type: '() => void', description: 'Fires on click / Enter.' },
        { name: 'useCommandPaletteShortcut', type: '(setOpen: (b: boolean) => void) => void', description: 'Wires ⌘K / Ctrl+K to toggle the dialog.' },
      ],
    },
  ],
  accessibility: [
    'Built on cmdk — proper combobox + listbox semantics.',
    'Arrow keys navigate, Enter selects, Esc closes.',
  ],
  related: [
    { slug: 'dropdown-menu', reason: 'For small, fixed action lists.' },
  ],
};

export default doc;
