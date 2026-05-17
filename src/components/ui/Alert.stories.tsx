import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: 'Your session expires soon',
    children: 'You will be signed out in 5 minutes due to inactivity.',
  },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-3">
      <Alert variant="info" title="Heads up">Read-only mode is on.</Alert>
      <Alert variant="success" title="Saved">Changes published to production.</Alert>
      <Alert variant="warning" title="Approaching limit">82% of monthly quota used.</Alert>
      <Alert variant="danger" title="Something went wrong">Could not connect to the database.</Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  args: { dismissible: true },
};
