import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from '@/icons';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RadioGroup, RadioItem } from '@/components/ui/RadioGroup';
import { Stepper } from '@/components/ui/Stepper';

const steps = [
  { title: 'Workspace' },
  { title: 'Invite team' },
  { title: 'Connect data' },
  { title: 'Done' },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-12">
      <Stepper steps={steps} current={step} />
      <Card>
        <CardHeader>
          <CardTitle>{stepHeader[step].title}</CardTitle>
          <CardDescription>{stepHeader[step].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <>
              <Input label="Workspace name" placeholder="Acme Inc." />
              <Input label="URL slug" prefix={<span>acme.app/</span>} placeholder="acme" />
            </>
          )}
          {step === 1 && (
            <>
              <Input
                type="email"
                label="Invite by email"
                placeholder="teammate@company.com"
                helperText="Separate multiple emails with commas."
              />
              <RadioGroup defaultValue="member">
                <RadioItem value="admin" label="Admin" description="Can manage workspace and billing." />
                <RadioItem value="member" label="Member" description="Can create and edit projects." />
                <RadioItem value="viewer" label="Viewer" description="Read-only access." />
              </RadioGroup>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-sm text-foreground-muted">
                Connect your data source so we can populate your first dashboard.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Postgres', 'BigQuery', 'Snowflake', 'CSV upload'].map((src) => (
                  <button
                    key={src}
                    type="button"
                    className="rounded-lg border border-border bg-card p-4 text-left hover:border-border-strong hover:bg-background-subtle transition-colors duration-[var(--duration-fast)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <p className="font-medium text-foreground">{src}</p>
                    <p className="text-xs text-foreground-subtle mt-1">Quick setup with SSO</p>
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-10 text-success-text" aria-hidden />
              <p className="text-base font-medium text-foreground">You're all set.</p>
              <p className="text-sm text-foreground-muted max-w-sm">
                Your workspace is ready. We've sent invites and your first dashboard is loading.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="ghost" leadingIcon={<ArrowLeft />} onClick={back} disabled={step === 0}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button trailingIcon={<ArrowRight />} onClick={next}>
            {step === steps.length - 2 ? 'Finish' : 'Continue'}
          </Button>
        ) : (
          <Button>Open workspace</Button>
        )}
      </div>
    </div>
  );
}

const stepHeader = [
  { title: 'Create your workspace', description: 'A workspace is where your team and projects live.' },
  { title: 'Invite your team', description: 'You can always invite more people later.' },
  { title: 'Connect a data source', description: 'Pick one — others can be added in settings.' },
  { title: 'Welcome aboard', description: "We've set up your starting dashboard." },
];
