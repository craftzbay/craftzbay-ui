import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Mail } from '@/icons';
import { Button } from '@craftzbay/ui';
import { Input } from '@craftzbay/ui';
import { Alert } from '@craftzbay/ui';
import { Separator } from '@craftzbay/ui';
import { Github } from '@/icons';

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

export interface SsoButtonsProps {
  /** Called with the provider id. */
  onProvider?: (provider: 'google' | 'github') => void;
}

/**
 * SSO buttons above the credential form, separated by an "or" rule. Keep to
 * ≤2 providers on the sign-in card; more belong on a dedicated page.
 */
export function SsoButtons({ onProvider }: SsoButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" className="w-full" leadingIcon={<GoogleMark />} onClick={() => onProvider?.('google')}>
          Google
        </Button>
        <Button type="button" variant="outline" className="w-full" leadingIcon={<Github />} onClick={() => onProvider?.('github')}>
          GitHub
        </Button>
      </div>
      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-foreground-subtle" role="separator" aria-label="or">
        <Separator className="flex-1" />
        or
        <Separator className="flex-1" />
      </div>
    </div>
  );
}

/** Monochrome "G" — brand marks stay neutral on a refined-minimal surface. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z" />
      <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5L6.4 10C7.2 7.8 9.4 6 12 6Z" />
    </svg>
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
      <SsoButtons />
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
      <SsoButtons />
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
