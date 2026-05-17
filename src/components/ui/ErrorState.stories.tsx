import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotFound, ServerError } from '@/illustrations';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'Feedback/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;

function withIcon(node: React.ReactNode) {
  return node;
}

export const Default404: Story = {
  args: { variant: '404', children: withIcon(<NotFound />) },
};
export const Default500: Story = {
  args: { variant: '500', onRetry: () => {}, children: withIcon(<ServerError />) },
};
export const Generic: Story = { args: { variant: 'generic', onRetry: () => {} } };
