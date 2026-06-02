import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@craftzbay/ui';
import { Input } from '@craftzbay/ui';
import { Alert } from '@craftzbay/ui';
import { Separator } from '@craftzbay/ui';

/* -----------------------------------------------------------------------------
 *  Authentication pattern — four screens that share the same shell.
 *
 *    <AuthLayout title="…" subtitle="…">…form…</AuthLayout>
 *
 *  Below: SignIn, SignUp, ForgotPassword, MagicLinkSent — each composed of
 *  primitives. They emit events; the host app handles network calls.
 * --------------------------------------------------------------------------- */

export interface AuthLayoutProps {
  /** Brand mark shown above the title. */
  brand?: ReactNode;
  /** Page heading. */
  title: ReactNode;
  /** Secondary line under the title. */
  subtitle?: ReactNode;
  /** Form / content. */
  children: ReactNode;
  /** Footer slot — "Don't have an account? Sign up". */
  footer?: ReactNode;
}

export function AuthLayout({ brand, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-background-subtle px-4 py-12">
      <div className="w-full max-w-[400px] space-y-6">
        {brand && <div className="flex justify-center">{brand}</div>}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-foreground-muted">{subtitle}</p>}
        </div>
        <div className="rounded-lg border border-border bg-card p-6">{children}</div>
        {footer && (
          <p className="text-center text-sm text-foreground-muted">{footer}</p>
        )}
      </div>
    </main>
  );
}

export interface SignInFormProps {
  onSubmit: (data: { email: string; password: string }) => void | Promise<void>;
  loading?: boolean;
  error?: ReactNode;
  /** Link target for "Forgot password?" (plain navigation). */
  forgotHref?: string;
  /** SPA handler for "Forgot password?" — takes precedence over `forgotHref`. */
  onForgot?: () => void;
}

export function SignInForm({ onSubmit, loading, error, forgotHref = '/forgot', onForgot }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      {error && <Alert variant="danger">{error}</Alert>}
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      <div className="flex items-center justify-end text-sm">
        {onForgot ? (
          <button
            type="button"
            onClick={onForgot}
            className="rounded-sm font-medium text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Forgot password?
          </button>
        ) : (
          <a
            href={forgotHref}
            className="rounded-sm font-medium text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Forgot password?
          </a>
        )}
      </div>
      <Button type="submit" loading={loading} className="w-full" trailingIcon={<ArrowRight />}>
        Sign in
      </Button>
    </form>
  );
}

export interface SignUpFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => void | Promise<void>;
  loading?: boolean;
  error?: ReactNode;
}

export function SignUpForm({ onSubmit, loading, error }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, email, password });
      }}
      className="space-y-4"
    >
      {error && <Alert variant="danger">{error}</Alert>}
      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        type="email"
        label="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <Input
        type="password"
        label="Password"
        helperText="At least 8 characters."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        Create account
      </Button>
      <p className="text-xs text-foreground-subtle text-center">
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}

export interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void | Promise<void>;
  loading?: boolean;
  error?: ReactNode;
}

export function ForgotPasswordForm({ onSubmit, loading, error }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(email);
      }}
      className="space-y-4"
    >
      {error && <Alert variant="danger">{error}</Alert>}
      <Input
        type="email"
        label="Email"
        helperText="We'll send a reset link if an account exists."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <Button type="submit" loading={loading} className="w-full" leadingIcon={<Mail />}>
        Send reset link
      </Button>
    </form>
  );
}

export interface MagicLinkSentProps {
  email: string;
  onResend?: () => void;
}

export function MagicLinkSent({ email, onResend }: MagicLinkSentProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-success-soft text-success-text">
        <CheckCircle2 className="size-6" aria-hidden />
      </div>
      <p className="text-sm text-foreground-muted">
        We sent a sign-in link to{' '}
        <span className="font-medium text-foreground">{email}</span>. Open it on this device to
        continue.
      </p>
      <Separator />
      <p className="text-xs text-foreground-subtle">
        Didn't get it?{' '}
        <button
          type="button"
          onClick={onResend}
          className="font-medium text-accent hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Resend
        </button>
      </p>
    </div>
  );
}
