import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Snackbar } from './Snackbar';

const meta = {
  title: 'Feedback/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  args: { title: 'Item moved', children: 'Atlas → Active projects' },
} satisfies Meta<typeof Snackbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Snackbar variant="info" title="Heads up">Switched to read-only mode.</Snackbar>
      <Snackbar variant="success" title="Saved">All changes published.</Snackbar>
      <Snackbar variant="warning" title="Heads up">Near monthly quota.</Snackbar>
      <Snackbar variant="danger" title="Error">Failed to upload 1 file.</Snackbar>
    </div>
  ),
};

export const WithAction: Story = {
  args: {
    action: <Button size="sm" variant="ghost">Undo</Button>,
    onClose: () => {},
  },
};
