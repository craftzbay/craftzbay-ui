import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { DesignSystemProvider, brandPresets, type BrandName } from './DesignSystemProvider';
import { Switch } from './Switch';

const meta: Meta = {
  title: 'Foundations/DesignSystemProvider',
};
export default meta;
type Story = StoryObj;

function BrandCard({ name }: { name: BrandName }) {
  return (
    <DesignSystemProvider tokens={brandPresets[name]}>
      <Card className="w-72">
        <CardHeader>
          <CardTitle className="capitalize">{name}</CardTitle>
          <CardDescription>Brand preset</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="outline">Outline</Button>
            <Badge tone="accent">Tag</Badge>
          </div>
          <Switch label="Notifications" defaultChecked />
        </CardContent>
      </Card>
    </DesignSystemProvider>
  );
}

export const Presets: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-6">
      <BrandCard name="default" />
      <BrandCard name="edgelog" />
      <BrandCard name="gerege" />
      <BrandCard name="forest" />
    </div>
  ),
};

export const CustomTokens: Story = {
  render: () => (
    <div className="flex gap-4 p-6">
      <DesignSystemProvider
        tokens={{
          'color-accent': '#e11d48',
          'color-accent-700': '#be123c',
          'color-accent-soft': '#ffe4e6',
          'radius-md': '14px',
        }}
      >
        <Card className="w-72">
          <CardHeader>
            <CardTitle>Custom</CardTitle>
            <CardDescription>Pass any tokens directly</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Button size="sm">Send</Button>
            <Button size="sm" variant="outline">Cancel</Button>
            <Badge tone="accent">New</Badge>
          </CardContent>
        </Card>
      </DesignSystemProvider>
    </div>
  ),
};
