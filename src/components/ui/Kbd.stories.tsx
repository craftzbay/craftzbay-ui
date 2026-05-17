import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './Kbd';

const meta = {
  title: 'Typography/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: { children: '⌘K' },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Combos: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm">
      Open palette with <Kbd>⌘</Kbd> + <Kbd>K</Kbd> · Save with <Kbd>⌘</Kbd> + <Kbd>S</Kbd>
    </div>
  ),
};
