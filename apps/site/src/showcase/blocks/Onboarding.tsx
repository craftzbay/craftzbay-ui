import { useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@craftzbay/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@craftzbay/ui';
import { Input } from '@craftzbay/ui';
import { RadioGroup, RadioItem } from '@craftzbay/ui';
import { Stepper } from '@craftzbay/ui';

/* -----------------------------------------------------------------------------
 *  Onboarding — multi-step wizard. Steps are declared as data; each step
 *  renders into a Card with a Stepper at the top and Back/Next controls below.
 * --------------------------------------------------------------------------- */

export interface OnboardingStepContext<T = unknown> {
  /** Move to the next step. */
  next: () => void;
  /** Move to the previous step. */
  prev: () => void;
  /** Jump to a step by index. */
  goTo: (index: number) => void;
  /** Finish the flow — calls onComplete. */
  finish: () => void;
  /** Current accumulated data across steps. */
  data: T;
  /** Patch the accumulated data. */
  setData: (patch: Partial<T>) => void;
}

export interface OnboardingStep<T = unknown> {
  /** Stable id used for keys + analytics. */
  id: string;
  /** Title shown in the Stepper. */
  title: string;
  /** Optional sub-description shown only in vertical Stepper. */
  description?: string;
  /** Card heading rendered when the step is active. */
  heading: ReactNode;
  /** Card description rendered under the heading. */
  subheading?: ReactNode;
  /** Step body. Receives navigation controls + shared data. */
  render: (ctx: OnboardingStepContext<T>) => ReactNode;
  /** Override the Continue / Finish button label. */
  ctaLabel?: string;
  /** Hide the default Back/Next bar — render your own inside `render`. */
  hideNavigation?: boolean;
}

export interface OnboardingProps<T = unknown> {
  steps?: OnboardingStep<T>[];
  /** Initial accumulated data. */
  initialData?: T;
  /** Called when the user advances past the last step. */
  onComplete?: (data: T) => void | Promise<void>;
  className?: string;
}

/* -----------------------------------------------------------------------------
 *  Default demo content — used when consumers render <Onboarding /> with no
 *  steps prop, and on the showcase preview page.
 * --------------------------------------------------------------------------- */

interface DemoData {
  workspaceName?: string;
  slug?: string;
  inviteEmail?: string;
  role?: string;
  source?: string;
}

const DEMO_STEPS: OnboardingStep<DemoData>[] = [
  {
    id: 'workspace',
    title: 'Workspace',
    heading: 'Create your workspace',
    subheading: 'A workspace is where your team and projects live.',
    render: ({ data, setData }) => (
      <>
        <Input
          label="Workspace name"
          placeholder="Acme Inc."
          value={data.workspaceName ?? ''}
          onChange={(e) => setData({ workspaceName: e.target.value })}
        />
        <Input
          label="URL slug"
          prefix={<span>acme.app/</span>}
          placeholder="acme"
          value={data.slug ?? ''}
          onChange={(e) => setData({ slug: e.target.value })}
        />
      </>
    ),
  },
  {
    id: 'invite',
    title: 'Invite team',
    heading: 'Invite your team',
    subheading: 'You can always invite more people later.',
    render: ({ data, setData }) => (
      <>
        <Input
          type="email"
          label="Invite by email"
          placeholder="teammate@company.com"
          helperText="Separate multiple emails with commas."
          value={data.inviteEmail ?? ''}
          onChange={(e) => setData({ inviteEmail: e.target.value })}
        />
        <RadioGroup
          value={data.role ?? 'member'}
          onValueChange={(role) => setData({ role })}
        >
          <RadioItem value="admin" label="Admin" description="Can manage workspace and billing." />
          <RadioItem value="member" label="Member" description="Can create and edit projects." />
          <RadioItem value="viewer" label="Viewer" description="Read-only access." />
        </RadioGroup>
      </>
    ),
  },
  {
    id: 'data',
    title: 'Connect data',
    heading: 'Connect a data source',
    subheading: 'Pick one — others can be added in settings.',
    render: ({ data, setData }) => (
      <>
        <p className="text-sm text-foreground-muted">
          Connect your data source so we can populate your first dashboard.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {['Postgres', 'BigQuery', 'Snowflake', 'CSV upload'].map((src) => {
            const active = data.source === src;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setData({ source: src })}
                aria-pressed={active}
                className={`rounded-lg border bg-card p-4 text-left transition-colors duration-[var(--duration-fast)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  active
                    ? 'border-accent bg-accent-soft'
                    : 'border-border hover:border-border-strong hover:bg-background-subtle'
                }`}
              >
                <p className="font-medium text-foreground">{src}</p>
                <p className="mt-1 text-xs text-foreground-subtle">Quick setup with SSO</p>
              </button>
            );
          })}
        </div>
      </>
    ),
  },
  {
    id: 'done',
    title: 'Done',
    heading: 'Welcome aboard',
    subheading: "We've set up your starting dashboard.",
    ctaLabel: 'Open workspace',
    render: () => (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="size-10 text-success-text" aria-hidden />
        <p className="text-base font-medium text-foreground">You're all set.</p>
        <p className="max-w-sm text-sm text-foreground-muted">
          Your workspace is ready. We've sent invites and your first dashboard is loading.
        </p>
      </div>
    ),
  },
];

/**
 * Multi-step onboarding wizard.
 *
 * @example
 *   <Onboarding<{ name: string; email: string }>
 *     initialData={{ name: '', email: '' }}
 *     steps={[
 *       { id: 'name', title: 'Name', heading: 'What should we call you?',
 *         render: ({ data, setData }) =>
 *           <Input value={data.name} onChange={(e) => setData({ name: e.target.value })} /> },
 *       …
 *     ]}
 *     onComplete={async (data) => api.completeOnboarding(data)}
 *   />
 */
export function Onboarding<T = DemoData>({
  steps = DEMO_STEPS as unknown as OnboardingStep<T>[],
  initialData = {} as T,
  onComplete,
  className,
}: OnboardingProps<T> = {}) {
  const [step, setStep] = useState(0);
  const [data, setDataState] = useState<T>(initialData);

  const setData = (patch: Partial<T>) =>
    setDataState((prev) => ({ ...prev, ...patch }) as T);

  const goTo = (i: number) => setStep(Math.max(0, Math.min(i, steps.length - 1)));
  const next = () => goTo(step + 1);
  const prev = () => goTo(step - 1);
  const finish = async () => {
    if (onComplete) await onComplete(data);
  };

  const ctx: OnboardingStepContext<T> = { next, prev, goTo, finish, data, setData };
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className={`mx-auto max-w-2xl space-y-8 py-12 ${className ?? ''}`}>
      <Stepper steps={steps.map((s) => ({ title: s.title, description: s.description }))} current={step} />

      <Card>
        <CardHeader>
          <CardTitle>{current.heading}</CardTitle>
          {current.subheading && <CardDescription>{current.subheading}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">{current.render(ctx)}</CardContent>
      </Card>

      {!current.hideNavigation && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            leadingIcon={<ArrowLeft />}
            onClick={prev}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button
            trailingIcon={isLast ? undefined : <ArrowRight />}
            onClick={isLast ? finish : next}
          >
            {current.ctaLabel ?? (isLast ? 'Finish' : 'Continue')}
          </Button>
        </div>
      )}
    </div>
  );
}
