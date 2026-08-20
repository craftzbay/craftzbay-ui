import { BarChart, LineChart } from '@/components/ui/Chart';
import type { ComponentDoc } from '../registry/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { AlertCircle, BarChart3 } from '@/icons';

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
      preview: (
        <BarChart
          data={data.slice(0, 6)}
          caption="Weekly signups"
          height={80}
          className="w-full max-w-md"
        />
      ),
      code: `<BarChart data={data.slice(0, 6)} caption="Weekly signups" height={80} />`,
    },
    {
      title: 'States',
      description:
        'Loading keeps the chart height with a Skeleton so nothing shifts; empty and error replace the plot with a compact EmptyState — never draw bare axes.',
      preview: (
        <div className="grid w-full gap-4 lg:grid-cols-3">
          <Skeleton className="h-[160px] w-full" />
          <EmptyState
            icon={<BarChart3 className="size-6" />}
            title="No data for this range"
            description="Try a wider date range."
            action={
              <Button size="sm" variant="outline">
                Last 90 days
              </Button>
            }
            className="h-[160px] p-4"
          />
          <EmptyState
            icon={<AlertCircle className="size-6" />}
            title="Couldn't load chart"
            action={
              <Button size="sm" variant="outline">
                Retry
              </Button>
            }
            className="h-[160px] p-4"
          />
        </div>
      ),
      code: `{loading ? (
  <Skeleton className="h-[160px] w-full" />
) : error ? (
  <EmptyState icon={<AlertCircle />} title="Couldn't load chart"
              action={<Button size="sm" variant="outline" onClick={retry}>Retry</Button>} />
) : data.length === 0 ? (
  <EmptyState icon={<BarChart3 />} title="No data for this range"
              action={<Button size="sm" variant="outline" onClick={widen}>Last 90 days</Button>} />
) : (
  <LineChart data={data} height={160} caption="MRR over time" />
)}`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'data',
          type: 'Array<{ x: number | string; y: number }>',
          required: true,
          description: 'Data points.',
        },
        {
          name: 'caption',
          type: 'string',
          description: 'Accessible caption — required for non-decorative charts.',
        },
        { name: 'height', type: 'number', default: '160', description: 'SVG height in px.' },
        { name: 'className', type: 'string', description: 'Width / spacing overrides.' },
      ],
    },
  ],
  accessibility: [
    'Renders <figure> with <figcaption> for the caption — screen readers announce it.',
    'For data-dense analytics, prefer a dedicated library (Recharts / Visx) with proper interactive tables.',
  ],
  guidelines: {
    do: [
      'Theming: series colours default to the six categorical tokens var(--chart-1) … var(--chart-6) (DEFAULT_CHART_COLORS). Override them per brand in globals.css rather than passing hex values via `colors`.',
    ],
    dont: ['Rely on colour alone to distinguish series — pair with a caption or legend.'],
  },
};

export default doc;
