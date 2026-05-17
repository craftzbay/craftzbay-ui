import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

const scale = [
  ['text-4xl', '36px / heading-1'],
  ['text-3xl', '28px / heading-2'],
  ['text-2xl', '22px / heading-3'],
  ['text-xl', '18px / heading-4'],
  ['text-lg', '16px / lead'],
  ['text-md', '15px'],
  ['text-base', '14px / body'],
  ['text-sm', '13px / UI default'],
  ['text-xs', '12px / caption'],
] as const;

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      {scale.map(([cls, label]) => (
        <div key={cls} className="flex items-baseline gap-6 border-b border-border pb-4">
          <code className="w-32 shrink-0 text-xs text-foreground-muted">{cls}</code>
          <span className="w-32 shrink-0 text-xs text-foreground-subtle">{label}</span>
          <p className={cls}>The quick brown fox jumps over the lazy dog.</p>
        </div>
      ))}
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8">
      <p className="text-lg font-normal">Regular — 400</p>
      <p className="text-lg font-medium">Medium — 500</p>
      <p className="text-lg font-semibold">Semibold — 600</p>
    </div>
  ),
};

export const Families: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <code className="text-xs text-foreground-muted">font-sans · Geist</code>
        <p className="text-2xl">Refined-minimal Tailwind v4 design system.</p>
      </div>
      <div>
        <code className="text-xs text-foreground-muted">font-mono · Geist Mono</code>
        <p className="text-2xl font-mono">const button = cva([...]);</p>
      </div>
    </div>
  ),
};
