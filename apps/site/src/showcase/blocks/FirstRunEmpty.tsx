import type { ReactNode } from 'react';
import { ArrowRight, Folder, Plus, Upload, Users } from 'lucide-react';
import { Button } from '@craftzbay/ui';
import { Card, CardContent } from '@craftzbay/ui';
import { EmptyState } from '@craftzbay/ui';

/* -----------------------------------------------------------------------------
 *  First-run empty product state. Combines a hero EmptyState with N
 *  "next step" cards — common pattern across Linear, Notion, Vercel.
 * --------------------------------------------------------------------------- */

export interface FirstRunNextStep {
  icon?: ReactNode;
  title: string;
  description: string;
  cta: string;
  onSelect?: () => void;
}

export interface FirstRunEmptyProps {
  /** Hero icon — typically a folder, sparkles, or product mark. */
  heroIcon?: ReactNode;
  /** Hero title. */
  title?: ReactNode;
  /** Hero subtitle. */
  description?: ReactNode;
  /** Primary CTA inside the hero (top tutorial / overview action). */
  primaryAction?: ReactNode;
  /** Next-step cards rendered below the hero. */
  steps?: FirstRunNextStep[];
  className?: string;
}

const DEFAULT_STEPS: FirstRunNextStep[] = [
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

/**
 * First-run empty product state.
 *
 * @example Default (uses built-in placeholder copy)
 *   <FirstRunEmpty />
 *
 * @example Customized
 *   <FirstRunEmpty
 *     heroIcon={<Illustrations.InboxEmpty className="size-16" />}
 *     title="Welcome to Atlas"
 *     description="Pick a starting point."
 *     steps={[
 *       { icon: <Plus />, title: 'New project', description: '…', cta: 'Create' },
 *       { icon: <Github />, title: 'Import repo', description: '…', cta: 'Connect' },
 *     ]}
 *   />
 */
export function FirstRunEmpty({
  heroIcon = <Folder className="size-6" />,
  title = 'Your workspace is ready',
  description = 'Start with one of the steps below — you can always come back to the others.',
  primaryAction = <Button trailingIcon={<ArrowRight />}>Open tutorial</Button>,
  steps = DEFAULT_STEPS,
  className,
}: FirstRunEmptyProps = {}) {
  return (
    <div className={`mx-auto max-w-3xl space-y-8 py-12 ${className ?? ''}`}>
      <EmptyState icon={heroIcon} title={title} description={description} action={primaryAction} />

      {steps.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((s) => (
            <Card key={s.title} variant="interactive">
              <CardContent className="space-y-3">
                {s.icon && (
                  <div className="inline-flex size-9 items-center justify-center rounded-md bg-accent-soft text-on-accent-soft [&_svg]:size-4">
                    {s.icon}
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                  <p className="text-xs text-foreground-muted leading-relaxed">{s.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  trailingIcon={<ArrowRight />}
                  onClick={s.onSelect}
                >
                  {s.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
