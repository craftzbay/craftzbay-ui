import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const steps = [
  { title: 'Account', description: 'Create your workspace' },
  { title: 'Team', description: 'Invite people' },
  { title: 'Billing', description: 'Pick a plan' },
  { title: 'Done', description: 'You are ready' },
];

const meta = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps, current: 1 },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
