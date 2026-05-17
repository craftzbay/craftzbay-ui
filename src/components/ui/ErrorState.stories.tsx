import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorState } from './ErrorState';

const meta = {
  title: 'Feedback/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = { args: { variant: '404' } };
export const ServerError: Story = { args: { variant: '500', onRetry: () => {} } };
export const Generic: Story = { args: { variant: 'generic', onRetry: () => {} } };
