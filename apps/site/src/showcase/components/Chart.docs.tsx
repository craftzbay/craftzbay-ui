import { BarChart, LineChart } from '@/components/ui/Chart';
import type { ComponentDoc } from '../registry/types';

const data = [22, 18, 26, 30, 35, 41, 38, 45, 50, 48, 56, 60].map((y, i) => ({ x: i, y }));

const doc: ComponentDoc = {
  slug: 'chart',
  name: 'Chart',
  group: 'Data Display',
  description:
    'Minimal SVG charts — LineChart and BarChart. No axes, grids, tooltips, or interactivity: purpose-built for inline trend illustration. For real analytics, integrate a charting library.',
  exports: ['LineChart', 'BarChart'],
  sourceFile: 'Chart.tsx',
  examples: [
    {
      title: 'LineChart',
      preview: <LineChart data={data} caption="MRR over time" className="w-full max-w-md" />,
      code: `const data = [22, 18, 26, 30, 35, 41].map((y, i) => ({ x: i, y }));

<LineChart data={data} caption="MRR over time" />`,
    },
    {
      title: 'BarChart',
      preview: <BarChart data={data.slice(0, 6)} caption="Weekly signups" height={80} className="w-full max-w-md" />,
      code: `<BarChart data={data.slice(0, 6)} caption="Weekly signups" height={80} />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'data', type: 'Array<{ x: number | string; y: number }>', required: true, description: 'Data points.' },
        { name: 'caption', type: 'string', description: 'Accessible caption — required for non-decorative charts.' },
        { name: 'height', type: 'number', default: '60', description: 'SVG height in px.' },
        { name: 'className', type: 'string', description: 'Width / spacing overrides.' },
      ],
    },
  ],
  accessibility: [
    'Renders <figure> with <figcaption> for the caption — screen readers announce it.',
    'For data-dense analytics, prefer a dedicated library (Recharts / Visx) with proper interactive tables.',
  ],
};

export default doc;
