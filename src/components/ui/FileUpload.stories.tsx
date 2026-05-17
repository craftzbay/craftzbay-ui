import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from './FileUpload';

const meta = {
  title: 'Primitives/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
} satisfies Meta<typeof FileUpload>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true, hint: 'PDF, PNG up to 5 MB' } };
export const ImagesOnly: Story = { args: { accept: 'image/*', multiple: true } };
export const Disabled: Story = { args: { disabled: true } };
