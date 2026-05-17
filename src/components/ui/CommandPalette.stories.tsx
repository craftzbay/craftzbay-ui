import type { Meta, StoryObj } from '@storybook/react-vite';
import { File, Settings, User } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './CommandPalette';

const meta: Meta = { title: 'Overlays/CommandPalette' };
export default meta;
type Story = StoryObj;

export const Inline: Story = {
  render: () => (
    <Command className="w-96 rounded-md border border-border bg-card">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem><File className="size-4" />New file<CommandShortcut>⌘N</CommandShortcut></CommandItem>
          <CommandItem><User className="size-4" />Invite user<CommandShortcut>⌘I</CommandShortcut></CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem><Settings className="size-4" />Preferences<CommandShortcut>⌘,</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
