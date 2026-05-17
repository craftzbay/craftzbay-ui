import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, RadioItem } from './RadioGroup';

const meta: Meta = { title: 'Primitives/RadioGroup' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="monthly" className="flex flex-col gap-2">
      <RadioItem value="monthly" label="Monthly · $12 / mo" />
      <RadioItem value="yearly" label="Yearly · $120 / yr (save 16%)" />
      <RadioItem value="enterprise" label="Enterprise · contact sales" />
    </RadioGroup>
  ),
};
