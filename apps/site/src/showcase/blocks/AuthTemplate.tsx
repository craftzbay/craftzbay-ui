import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert } from '@craftzbay/ui';
import type { TemplateProps } from './meta';
import {
  AuthLayout,
  ForgotPasswordForm,
  MagicLinkSent,
  SignInForm,
  SignUpForm,
} from './Authentication';
import { readHashParams } from './admin/use-hash-params';

/**
 * Authentication template — the full auth flow on the single-column, centred AuthLayout:
 * sign in, sign up, forgot password and the magic-link confirmation. The links
 * are real: footer links and "Forgot password?" move between the screens (you
 * can also jump straight to any screen from the preview dock). Submitting the
 * forgot form advances to the magic-link confirmation.
 */
const noop = async () => {};

/**
 * Demo network: 800ms of `loading`, then success — or the error branch when
 * the preview URL carries `?demo=error` (`#preview/auth/signin?demo=error`).
 */
function useDemoSubmit(screen: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const timer = useRef<number>();
  // Reset when the screen changes; clear a pending timer on unmount.
  useEffect(() => {
    setLoading(false);
    setError(null);
    setDone(false);
    return () => window.clearTimeout(timer.current);
  }, [screen]);
  const submit = (onSuccess?: () => void) => {
    setError(null);
    setDone(false);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      if (readHashParams().get('demo') === 'error') {
        setError("That email and password don't match. Check both and try again.");
      } else {
        setDone(true);
        onSuccess?.();
      }
    }, 800);
  };
  return { loading, error, done, submit };
}

const DEMO_HINT = (
  <span className="text-foreground-subtle block text-xs">
    Demo: submissions succeed after 800ms. Add <code>?demo=error</code> to the URL to preview the
    error state.
  </span>
);

function FootLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-accent focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
}

export function AuthTemplate({ screen, setScreen, brand }: TemplateProps) {
  const demo = useDemoSubmit(screen);
  const success = demo.done && (
    <Alert variant="success" live className="mb-4">
      Signed in — this is a demo, nothing was sent.
    </Alert>
  );
  switch (screen) {
    case 'signup':
      return (
        <AuthLayout
          brand={brand}
          title="Create your account"
          subtitle="Start free, no credit card."
          footer={
            <>
              Already have an account?{' '}
              <FootLink onClick={() => setScreen('signin')}>Sign in</FootLink>
              {DEMO_HINT}
            </>
          }
        >
          {success}
          <SignUpForm onSubmit={() => demo.submit()} loading={demo.loading} error={demo.error} />
        </AuthLayout>
      );
    case 'forgot':
      return (
        <AuthLayout
          brand={brand}
          title="Forgot password?"
          subtitle="We'll email you a reset link."
          footer={
            <>
              <FootLink onClick={() => setScreen('signin')}>Back to sign in</FootLink>
            </>
          }
        >
          <ForgotPasswordForm
            onSubmit={() => demo.submit(() => setScreen('magic'))}
            loading={demo.loading}
            error={demo.error}
          />
        </AuthLayout>
      );
    case 'magic':
      return (
        <AuthLayout
          brand={brand}
          title="Check your inbox"
          subtitle="We sent a magic link to your email."
          footer={
            <>
              <FootLink onClick={() => setScreen('signin')}>Back to sign in</FootLink>
            </>
          }
        >
          <MagicLinkSent email="you@example.com" onResend={noop} />
        </AuthLayout>
      );
    default:
      return (
        <AuthLayout
          brand={brand}
          title="Sign in"
          subtitle="Welcome back. Sign in to continue."
          footer={
            <>
              Don't have an account?{' '}
              <FootLink onClick={() => setScreen('signup')}>Sign up</FootLink>
              {DEMO_HINT}
            </>
          }
        >
          {success}
          <SignInForm
            onSubmit={() => demo.submit()}
            loading={demo.loading}
            error={demo.error}
            onForgot={() => setScreen('forgot')}
          />
        </AuthLayout>
      );
  }
}
