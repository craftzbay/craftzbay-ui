import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

function Swatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-16 w-full rounded-md border border-border"
        style={{ background: `var(${cssVar})` }}
      />
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium">{name}</span>
        <code className="text-[10px] text-foreground-muted">{cssVar}</code>
      </div>
    </div>
  );
}

function Group({ title, swatches }: { title: string; swatches: [string, string][] }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {swatches.map(([name, v]) => (
          <Swatch key={v} name={name} cssVar={v} />
        ))}
      </div>
    </section>
  );
}

export const Semantic: Story = {
  render: () => (
    <div className="flex flex-col gap-10 p-8">
      <Group
        title="Surface"
        swatches={[
          ['background', '--color-background'],
          ['background-muted', '--color-background-muted'],
          ['background-subtle', '--color-background-subtle'],
          ['card', '--color-card'],
        ]}
      />
      <Group
        title="Foreground"
        swatches={[
          ['foreground', '--color-foreground'],
          ['foreground-muted', '--color-foreground-muted'],
          ['foreground-subtle', '--color-foreground-subtle'],
        ]}
      />
      <Group
        title="Border"
        swatches={[
          ['border', '--color-border'],
          ['border-strong', '--color-border-strong'],
          ['ring', '--color-ring'],
        ]}
      />
      <Group
        title="Brand & state"
        swatches={[
          ['accent', '--color-accent'],
          ['accent-700', '--color-accent-700'],
          ['success', '--color-success'],
          ['warning', '--color-warning'],
          ['danger', '--color-danger'],
        ]}
      />
    </div>
  ),
};
