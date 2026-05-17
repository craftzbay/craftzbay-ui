import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './ScrollArea';

const meta: Meta = { title: 'Layout/ScrollArea' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-md border border-border p-3">
      <div className="flex flex-col gap-2 text-sm">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i}>Item #{i + 1}</div>
        ))}
      </div>
    </ScrollArea>
  ),
};
