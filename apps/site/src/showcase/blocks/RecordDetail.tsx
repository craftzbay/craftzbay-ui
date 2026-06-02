import type { ReactNode } from 'react';
import { Edit2, ExternalLink, Trash2 } from 'lucide-react';
import { Avatar } from '@craftzbay/ui';
import { Badge } from '@craftzbay/ui';
import { Breadcrumbs } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@craftzbay/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@craftzbay/ui';

/* -----------------------------------------------------------------------------
 *  RecordDetail — header + tabs + side panel layout for any "thing detail
 *  page" (user, project, ticket, order).
 * --------------------------------------------------------------------------- */

export interface RecordDetailHeader {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional status pill rendered next to the title. */
  status?: ReactNode;
  /** Right-aligned action buttons. */
  actions?: ReactNode;
  /** Breadcrumb trail rendered above the header. */
  breadcrumbs?: { label: ReactNode; href?: string }[];
}

export interface RecordDetailTab {
  id: string;
  label: ReactNode;
  render: () => ReactNode;
}

export interface RecordDetailProps {
  header?: RecordDetailHeader;
  tabs?: RecordDetailTab[];
  /** Initial tab id. Defaults to the first tab. */
  defaultTab?: string;
  /** Optional right-side panel (related items, details list, watchers, …). */
  sidePanel?: ReactNode;
  className?: string;
}

/* -----------------------------------------------------------------------------
 *  Defaults — used when consumers render <RecordDetail /> with no props.
 * --------------------------------------------------------------------------- */

const DEMO_HEADER: RecordDetailHeader = {
  title: 'Pulse onboarding',
  subtitle:
    'Self-serve onboarding flow for new admins. Owns the first 5 minutes of every workspace.',
  status: (
    <Badge tone="success" dot>
      Active
    </Badge>
  ),
  actions: (
    <>
      <Button variant="outline" leadingIcon={<Edit2 />}>
        Edit
      </Button>
      <Button variant="outline" leadingIcon={<Trash2 />}>
        Archive
      </Button>
      <Button trailingIcon={<ExternalLink />}>Open in app</Button>
    </>
  ),
  breadcrumbs: [{ label: 'Projects', href: '/projects' }, { label: 'Pulse onboarding' }],
};

const DEMO_TABS: RecordDetailTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 leading-relaxed text-foreground-muted">
          <p>
            The Pulse onboarding flow walks new admins through workspace creation, teammate
            invites, and first-data import in under five minutes.
          </p>
          <p>
            Completion rate sits at 71% (week-over-week +4 pts) and median time to finish is 4 m
            22 s.
          </p>
        </CardContent>
      </Card>
    ),
  },
  { id: 'activity', label: 'Activity', render: () => <P>Activity feed appears here.</P> },
  { id: 'files', label: 'Files', render: () => <P>Linked documents appear here.</P> },
  { id: 'settings', label: 'Settings', render: () => <P>Project settings appear here.</P> },
];

const DEMO_SIDE_PANEL: ReactNode = (
  <>
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Owner" value={<><Avatar size="xs" fallback="AB" /> Anu B.</>} />
        <Row label="Created" value="12 Feb 2026" />
        <Row label="Updated" value="2 hours ago" />
        <Row
          label="Tags"
          value={
            <>
              <Badge tone="accent">growth</Badge>{' '}
              <Badge tone="neutral" variant="outline">v2</Badge>
            </>
          }
        />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Watchers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex -space-x-2">
          <Avatar fallback="AB" />
          <Avatar fallback="BE" />
          <Avatar fallback="TG" />
          <Avatar fallback="+2" />
        </div>
      </CardContent>
    </Card>
  </>
);

/**
 * Record detail page — header (breadcrumbs + title + actions) + tabs + side panel.
 *
 * @example
 *   <RecordDetail
 *     header={{
 *       title: project.name,
 *       subtitle: project.description,
 *       status: <Badge tone="success">Active</Badge>,
 *       actions: <Button>Share</Button>,
 *       breadcrumbs: [{ label: 'Projects', href: '/projects' }, { label: project.name }],
 *     }}
 *     tabs={[
 *       { id: 'overview', label: 'Overview', render: () => <Overview project={project} /> },
 *       { id: 'activity', label: 'Activity', render: () => <Activity projectId={project.id} /> },
 *     ]}
 *     sidePanel={<RelatedItems project={project} />}
 *   />
 */
export function RecordDetail({
  header = DEMO_HEADER,
  tabs = DEMO_TABS,
  defaultTab,
  sidePanel = DEMO_SIDE_PANEL,
  className,
}: RecordDetailProps = {}) {
  const initialTab = defaultTab ?? tabs[0]?.id ?? '';
  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      {header.breadcrumbs && header.breadcrumbs.length > 0 && (
        <Breadcrumbs items={header.breadcrumbs} />
      )}

      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {header.title}
            </h1>
            {header.status}
          </div>
          {header.subtitle && (
            <p className="max-w-2xl text-sm text-foreground-muted">{header.subtitle}</p>
          )}
        </div>
        {header.actions && <div className="flex items-center gap-2">{header.actions}</div>}
      </header>

      <div
        className={
          sidePanel ? 'grid gap-6 lg:grid-cols-[1fr_320px]' : 'min-w-0'
        }
      >
        <div className="min-w-0">
          <Tabs defaultValue={initialTab}>
            <TabsList>
              {tabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((t) => (
              <TabsContent key={t.id} value={t.id} className="space-y-4">
                {t.render()}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {sidePanel && <aside className="space-y-4">{sidePanel}</aside>}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-foreground-subtle">{label}</span>
      <span className="flex items-center gap-1.5 text-foreground">{value}</span>
    </div>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-sm text-foreground-muted">{children}</p>;
}
