import { type ReactNode } from 'react';
import type { TemplateProps } from './meta';
import { AuthLayout, ForgotPasswordForm, MagicLinkSent, SignInForm, SignUpForm } from './Authentication';

/**
 * Authentication template — the full auth flow on the single-column, centred AuthLayout:
 * sign in, sign up, forgot password and the magic-link confirmation. The links
 * are real: footer links and "Forgot password?" move between the screens (you
 * can also jump straight to any screen from the preview dock). Submitting the
 * forgot form advances to the magic-link confirmation.
 */
const noop = async () => {};

function FootLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-sm font-medium text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  );
}

export function AuthTemplate({ screen, setScreen, brand }: TemplateProps) {
  switch (screen) {
    case 'signup':
      return (
        <AuthLayout
          brand={brand}
          title="Create your account"
          subtitle="Start free, no credit card."
          footer={<>Already have an account? <FootLink onClick={() => setScreen('signin')}>Sign in</FootLink></>}
        >
          <SignUpForm onSubmit={noop} />
        </AuthLayout>
      );
    case 'forgot':
      return (
        <AuthLayout
          brand={brand}
          title="Forgot password?"
          subtitle="We'll email you a reset link."
          footer={<><FootLink onClick={() => setScreen('signin')}>Back to sign in</FootLink></>}
        >
          <ForgotPasswordForm onSubmit={() => setScreen('magic')} />
        </AuthLayout>
      );
    case 'magic':
      return (
        <AuthLayout
          brand={brand}
          title="Check your inbox"
          subtitle="We sent a magic link to your email."
          footer={<><FootLink onClick={() => setScreen('signin')}>Back to sign in</FootLink></>}
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
          footer={<>Don't have an account? <FootLink onClick={() => setScreen('signup')}>Sign up</FootLink></>}
        >
          <SignInForm onSubmit={noop} onForgot={() => setScreen('forgot')} />
        </AuthLayout>
      );
  }
}
