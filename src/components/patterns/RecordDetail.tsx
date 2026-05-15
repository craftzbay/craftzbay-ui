import { Edit2, ExternalLink, Trash2 } from '@/icons';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export function RecordDetail() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Projects', href: '/projects' },
          { label: 'Pulse onboarding' },
        ]}
      />

      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Pulse onboarding
            </h1>
            <Badge tone="success" dot>
              Active
            </Badge>
          </div>
          <p className="text-sm text-foreground-muted max-w-2xl">
            Self-serve onboarding flow for new admins. Owns the first 5 minutes of every
            workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leadingIcon={<Edit2 />}>
            Edit
          </Button>
          <Button variant="outline" leadingIcon={<Trash2 />}>
            Archive
          </Button>
          <Button trailingIcon={<ExternalLink />}>Open in app</Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-foreground-muted leading-relaxed">
                  <p>
                    The Pulse onboarding flow walks new admins through workspace creation,
                    teammate invites, and first-data import in under five minutes.
                  </p>
                  <p>
                    Completion rate sits at 71% (week-over-week +4 pts) and median time to
                    finish is 4 m 22 s.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity">
              <p className="text-sm text-foreground-muted">Activity feed appears here.</p>
            </TabsContent>
            <TabsContent value="files">
              <p className="text-sm text-foreground-muted">Linked documents appear here.</p>
            </TabsContent>
            <TabsContent value="settings">
              <p className="text-sm text-foreground-muted">Project settings appear here.</p>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Owner" value={<><Avatar size="xs" fallback="AB" /> Anu B.</>} />
              <Row label="Created" value="12 Feb 2026" />
              <Row label="Updated" value="2 hours ago" />
              <Row label="Tags" value={<><Badge tone="accent">growth</Badge> <Badge tone="neutral" variant="outline">v2</Badge></>} />
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
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-foreground-subtle">{label}</span>
      <span className="flex items-center gap-1.5 text-foreground">{value}</span>
    </div>
  );
}
