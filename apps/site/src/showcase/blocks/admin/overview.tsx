import { ArrowDown, ArrowUp, Plus } from '@/icons';
import {
  Avatar,
  Badge,
  BarChart,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LineChart,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@craftzbay/ui';
import { useState } from 'react';
import { ACTIVITY, CHANNELS, SERIES_A, SERIES_B } from './data';
import { PageHeader } from './shell';

/* =============================================================================
 *  Admin template — Overview, Analytics, Reports (KPI row → chart → table)
 * ========================================================================== */

/**
 * KPI tile: label → value (tabular) → delta. The delta carries arrow + sign +
 * colour and names the comparison window, so it reads without colour.
 */
export function KpiTile({
  label,
  value,
  delta,
  /** True when the change is good for the business (a falling error rate is positive). */
  positive,
  compare = 'vs last 30d',
}: {
  label: string;
  value: string;
  delta?: number;
  positive?: boolean;
  compare?: string;
}) {
  const up = delta !== undefined && delta >= 0;
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="text-foreground-muted text-xs font-medium">{label}</div>
        <div className="tabular text-foreground mt-1 text-2xl font-semibold tracking-tight">
          {value}
        </div>
        {delta !== undefined && (
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                'tabular inline-flex items-center gap-0.5 font-medium',
                positive ? 'text-success-text' : 'text-danger-text',
              )}
            >
              {up ? (
                <ArrowUp className="size-3" aria-hidden />
              ) : (
                <ArrowDown className="size-3" aria-hidden />
              )}
              <span className="sr-only">{up ? 'up' : 'down'}</span>
              {up ? '+' : '−'}
              {Math.abs(delta).toLocaleString('en-US', { maximumFractionDigits: 2 })}%
            </span>
            <span className="text-foreground-subtle">{compare}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** One period filter at the top, shared by every widget on the page. */
function RangeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" aria-label="Time range" className="w-36" />
      <SelectContent>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <SelectItem value="90d">Last 90 days</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function Overview({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [range, setRange] = useState('30d');
  const compare = `vs previous ${range.replace('d', ' days')}`;
  return (
    <div>
      <PageHeader
        page="overview"
        title="Overview"
        subtitle="What's happening across your workspace."
        actions={<RangeSelect value={range} onChange={setRange} />}
        onNavigate={onNavigate}
      />
      <section aria-label="Key metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile label="Active users" value="2,840" delta={12} positive compare={compare} />
        <KpiTile label="Sessions" value="8,402" delta={4} positive compare={compare} />
        <KpiTile label="Open issues" value="14" delta={-6} positive compare={compare} />
        <KpiTile label="Error rate" value="0.32%" delta={0.05} compare={compare} />
      </section>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Active users per day</CardTitle>
          <CardDescription>
            Distinct sessions,{' '}
            {range === '7d' ? 'last 7 days' : range === '90d' ? 'last 90 days' : 'last 30 days'}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Two series → categorical colours, not the brand accent. */}
          <LineChart
            series={[
              { name: 'This period', data: SERIES_A },
              { name: 'Previous period', data: SERIES_B },
            ]}
            height={200}
            caption="Active users trend up 12% over the period, ahead of the previous period."
          />
        </CardContent>
      </Card>

      <Card padding="none" className="mt-4">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 px-5 pt-5">
          <CardTitle>Recent activity</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('inbox')}>
            View all
          </Button>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Who</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ACTIVITY.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="xs" fallback={r.initials} alt="" />
                    <span className="text-foreground">{r.who}</span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground-muted">{r.action}</TableCell>
                <TableCell>
                  <Badge tone="neutral" variant="outline">
                    {r.target}
                  </Badge>
                </TableCell>
                <TableCell className="tabular text-foreground-subtle text-right">
                  {r.when}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export function Analytics({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [range, setRange] = useState('30d');
  return (
    <div>
      <PageHeader
        page="analytics"
        title="Analytics"
        subtitle="Traffic and engagement breakdown."
        actions={<RangeSelect value={range} onChange={setRange} />}
        onNavigate={onNavigate}
      />
      <section aria-label="Key metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile label="Page views" value="128k" delta={8} positive />
        <KpiTile label="Avg. session" value="4m 12s" delta={5.8} positive />
        <KpiTile label="Bounce rate" value="38%" delta={-2} positive />
      </section>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sessions per day</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={SERIES_B} height={200} caption="Sessions are flat week over week." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Traffic by channel</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={CHANNELS}
              height={200}
              caption="Direct is the largest channel at 4,200 sessions."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Reports({ onNavigate }: { onNavigate: (key: string) => void }) {
  return (
    <div>
      <PageHeader
        page="reports"
        title="Reports"
        subtitle="Saved and scheduled reports."
        actions={
          <Button size="sm" leadingIcon={<Plus />}>
            New report
          </Button>
        }
        onNavigate={onNavigate}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly active users</CardTitle>
            <CardDescription>Updated daily</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={SERIES_A} height={180} caption="Weekly active users, last 30 days." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by channel</CardTitle>
            <CardDescription>This quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={CHANNELS}
              height={180}
              caption="Revenue by acquisition channel, this quarter."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
