import { ArrowDown, ArrowUp, Inbox, Plus } from '@/icons';
import {
  Avatar,
  Badge,
  BarChart,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  EmptyState,
  ErrorState,
  LineChart,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  formatNumber,
  type ChartState,
} from '@craftzbay/ui';
import { useState, type ReactNode } from 'react';
import { ACTIVITY, CHANNELS, SERIES_A, SERIES_B } from './data';
import { PageHeader, useDemo, type DemoState } from './shell';

/** Demo state → chart state (`normal` draws the chart). */
const chartState = (s: DemoState): ChartState | undefined => (s === 'normal' ? undefined : s);

/** Page-level failure with retry — shared by the three dashboard pages. */
function PageError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      variant="500"
      title="Couldn't load this page"
      description="The metrics service didn't respond. Nothing was changed — try again."
      onRetry={onRetry}
      live
    />
  );
}

/** KPI tile placeholder — same box so the row doesn't jump. */
function KpiSkeleton() {
  return (
    <Card aria-hidden>
      <CardContent className="space-y-2 pt-4 md:pt-6">
        <Skeleton variant="text" className="w-20" />
        <Skeleton className="h-8 w-28" />
        <Skeleton variant="text" className="w-32" />
      </CardContent>
    </Card>
  );
}

function KpiRow({
  loading,
  columns,
  children,
}: {
  loading: boolean;
  columns: string;
  children: ReactNode;
}) {
  return (
    <section aria-label="Key metrics" className={cn('grid grid-cols-1 gap-3', columns)}>
      {loading
        ? Array.from({ length: 4 }, (_, i) => <KpiSkeleton key={i} />).slice(0, 4)
        : children}
    </section>
  );
}

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
      <CardContent className="pt-4 md:pt-6">
        <div className="text-foreground-muted text-xs font-medium">{label}</div>
        <div className="tabular text-foreground mt-1 text-3xl font-semibold tracking-tight">
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
              {formatNumber(Math.abs(delta))}%
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
  const demo = useDemo();
  const compare = `vs previous ${range.replace('d', ' days')}`;
  const header = (
    <PageHeader
      page="overview"
      title="Overview"
      subtitle="What's happening across your workspace."
      actions={<RangeSelect value={range} onChange={setRange} />}
      onNavigate={onNavigate}
    />
  );
  if (demo.state === 'error')
    return (
      <div>
        {header}
        <PageError onRetry={() => demo.setState('normal')} />
      </div>
    );
  const empty = demo.state === 'empty';
  const activity = empty ? [] : ACTIVITY;
  return (
    <div>
      {header}
      <KpiRow loading={demo.state === 'loading'} columns="sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label="Active users"
          value={empty ? '—' : '2,840'}
          delta={empty ? undefined : 12}
          positive
          compare={compare}
        />
        <KpiTile
          label="Sessions"
          value={empty ? '—' : '8,402'}
          delta={empty ? undefined : 4}
          positive
          compare={compare}
        />
        <KpiTile
          label="Open issues"
          value={empty ? '—' : '14'}
          delta={empty ? undefined : -6}
          positive
          compare={compare}
        />
        <KpiTile
          label="Error rate"
          value={empty ? '—' : '0.32%'}
          delta={empty ? undefined : 0.05}
          compare={compare}
        />
      </KpiRow>

      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-foreground text-base leading-none font-semibold">
            Active users per day
          </h2>
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
            state={chartState(demo.state)}
            caption="Active users trend up 12% over the period, ahead of the previous period."
          />
        </CardContent>
      </Card>

      <Card padding="none" className="mt-4">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 px-4 pt-4 md:px-6 md:pt-6">
          <h2 className="text-foreground text-base leading-none font-semibold">Recent activity</h2>
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
            {demo.state === 'loading' &&
              Array.from({ length: 4 }, (_, i) => (
                <TableRow key={`sk-${i}`} aria-hidden>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton variant="avatar" className="size-6" />
                      <Skeleton variant="text" className="w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" className="w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" className="ml-auto w-12" />
                  </TableCell>
                </TableRow>
              ))}
            {activity.length === 0 && demo.state !== 'loading' && (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <EmptyState
                    icon={<Inbox />}
                    title="No activity yet"
                    description="Merges, comments and status changes across the workspace land here."
                    className="min-h-[160px] rounded-none border-0 bg-transparent"
                  />
                </TableCell>
              </TableRow>
            )}
            {activity.map((r) => (
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
  const demo = useDemo();
  const header = (
    <PageHeader
      page="analytics"
      title="Analytics"
      subtitle="Traffic and engagement breakdown."
      actions={<RangeSelect value={range} onChange={setRange} />}
      onNavigate={onNavigate}
    />
  );
  if (demo.state === 'error')
    return (
      <div>
        {header}
        <PageError onRetry={() => demo.setState('normal')} />
      </div>
    );
  const empty = demo.state === 'empty';
  return (
    <div>
      {header}
      <KpiRow loading={demo.state === 'loading'} columns="sm:grid-cols-3">
        <KpiTile
          label="Page views"
          value={empty ? '—' : '128k'}
          delta={empty ? undefined : 8}
          positive
        />
        <KpiTile
          label="Avg. session"
          value={empty ? '—' : '4m 12s'}
          delta={empty ? undefined : 5.8}
          positive
        />
        <KpiTile
          label="Bounce rate"
          value={empty ? '—' : '38%'}
          delta={empty ? undefined : -2}
          positive
        />
      </KpiRow>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              Sessions per day
            </h2>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={SERIES_B}
              height={200}
              state={chartState(demo.state)}
              caption="Sessions are flat week over week."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              Traffic by channel
            </h2>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={CHANNELS}
              height={200}
              state={chartState(demo.state)}
              caption="Direct is the largest channel at 4,200 sessions."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Reports({ onNavigate }: { onNavigate: (key: string) => void }) {
  const demo = useDemo();
  const header = (
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
  );
  if (demo.state === 'error')
    return (
      <div>
        {header}
        <PageError onRetry={() => demo.setState('normal')} />
      </div>
    );
  return (
    <div>
      {header}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              Weekly active users
            </h2>
            <CardDescription>Updated daily</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={SERIES_A}
              height={180}
              state={chartState(demo.state)}
              caption="Weekly active users, last 30 days."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              Revenue by channel
            </h2>
            <CardDescription>This quarter</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={CHANNELS}
              height={180}
              state={chartState(demo.state)}
              caption="Revenue by acquisition channel, this quarter."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
