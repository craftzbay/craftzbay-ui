import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './Toast';

const meta: Meta = { title: 'Feedback/Toast' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ToastProvider duration={Infinity}>
      <Toast open>
        <div className="grid gap-0.5">
          <ToastTitle>Changes saved</ToastTitle>
          <ToastDescription>Your settings have been updated.</ToastDescription>
        </div>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
