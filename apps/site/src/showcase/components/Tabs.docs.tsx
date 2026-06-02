import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  group: 'Navigation',
  description:
    'Switch between sibling sections without page navigation. Use underline for content sections, pills for filter-style toggles.',
  exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
  sourceFile: 'Tabs.tsx',
  examples: [
    {
      title: 'Underline (default)',
      preview: (
        <Tabs defaultValue="overview" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-3 text-sm text-foreground-muted">Overview content.</TabsContent>
          <TabsContent value="activity" className="pt-3 text-sm text-foreground-muted">Activity log.</TabsContent>
          <TabsContent value="files" className="pt-3 text-sm text-foreground-muted">Files list.</TabsContent>
        </Tabs>
      ),
      code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="files">Files</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="activity">…</TabsContent>
</Tabs>`,
    },
    {
      title: 'Pills',
      preview: (
        <Tabs defaultValue="day" className="w-full max-w-sm">
          <TabsList variant="pills">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      ),
      code: `<TabsList variant="pills">
  <TabsTrigger value="day">Day</TabsTrigger>
  <TabsTrigger value="week">Week</TabsTrigger>
  <TabsTrigger value="month">Month</TabsTrigger>
</TabsList>`,
    },
  ],
  api: [
    {
      title: 'Tabs (root)',
      rows: [
        { name: 'value', type: 'string', description: 'Controlled active tab.' },
        { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Fires on tab change.' },
        { name: 'orientation', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: 'Layout direction.' },
      ],
    },
    {
      title: 'TabsList',
      rows: [
        { name: 'variant', type: `'underline' | 'pills'`, default: `'underline'`, description: 'Visual style.' },
        { name: 'size', type: `'sm' | 'md' | 'lg'`, default: `'md'`, description: 'Trigger height.' },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-tabs — Arrow keys cycle, Home/End jump.',
    'Auto-activated by default; set activationMode="manual" if Enter should be required.',
  ],
  related: [
    { slug: 'accordion', reason: 'Vertical alternative for stacked sections.' },
  ],
};

export default doc;
