import { ArrowRight, Folder, Plus, Upload, Users } from '@/icons';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

/* -----------------------------------------------------------------------------
 *  First-run empty product state. Combines a hero EmptyState with three
 *  "next step" cards — common pattern across Linear, Notion, Vercel.
 * --------------------------------------------------------------------------- */

interface NextStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}

const steps: NextStep[] = [
  {
    icon: <Plus />,
    title: 'Create a project',
    description: 'Track a real piece of work end-to-end.',
    cta: 'New project',
  },
  {
    icon: <Upload />,
    title: 'Import existing data',
    description: 'CSV, Postgres, BigQuery, or Snowflake — connect in a minute.',
    cta: 'Connect source',
  },
  {
    icon: <Users />,
    title: 'Invite your team',
    description: "Workspaces are better with teammates. We'll send the invites.",
    cta: 'Invite people',
  },
];

export function FirstRunEmpty() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-12">
      <EmptyState
        icon={<Folder className="size-6" />}
        title="Your workspace is ready"
        description="Start with one of the steps below — you can always come back to the others."
        action={<Button trailingIcon={<ArrowRight />}>Open tutorial</Button>}
      />

      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.title} variant="interactive">
            <CardContent className="space-y-3">
              <div className="inline-flex size-9 items-center justify-center rounded-md bg-accent-soft text-on-accent-soft [&_svg]:size-4">
                {s.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{s.description}</p>
              </div>
              <Button variant="ghost" size="sm" trailingIcon={<ArrowRight />}>
                {s.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
