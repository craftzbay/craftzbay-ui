import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ConnectionLost,
  Construction,
  InboxEmpty,
  NoSearchResults,
  NotFound,
  ServerError,
} from '@/illustrations';

const meta: Meta = {
  title: 'Foundations/Illustrations',
};
export default meta;
type Story = StoryObj;

const items = [
  { name: 'InboxEmpty', C: InboxEmpty },
  { name: 'NoSearchResults', C: NoSearchResults },
  { name: 'NotFound', C: NotFound },
  { name: 'ServerError', C: ServerError },
  { name: 'Construction', C: Construction },
  { name: 'ConnectionLost', C: ConnectionLost },
] as const;

export const All: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-3">
      {items.map(({ name, C }) => (
        <figure key={name} className="flex flex-col items-center gap-3 rounded-md border border-border bg-card p-6">
          <C />
          <figcaption className="text-xs text-foreground-muted">{name}</figcaption>
        </figure>
      ))}
    </div>
  ),
};
