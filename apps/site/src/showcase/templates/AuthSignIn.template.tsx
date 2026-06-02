import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'auth-signin',
  name: 'Sign in',
  description:
    'Centered sign-in form with email + password, social providers, and a "forgot password" link. Drop-in: pass logo, title, footer; handle the submit event.',
  exports: ['AuthLayout', 'SignInForm'],
  sourceFile: 'Authentication.tsx',
  previewSlug: 'auth-signin',
  useCases: ['Customer SaaS sign-in page', 'Internal admin login'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the{' '}
          <a className="text-accent hover:underline" href="#preview/auth-signin">
            full-page preview ↗
          </a>{' '}
          to see the template rendered.
        </div>
      ),
      code: `import { AuthLayout, SignInForm } from '@craftzbay/ui';

<AuthLayout
  brand={<Logo />}
  title="Sign in"
  subtitle="Welcome back. Sign in to continue."
  footer={<a href="/signup">Create account</a>}
>
  <SignInForm
    onSubmit={async ({ email, password }) => {
      await api.signIn({ email, password });
    }}
    providers={['google', 'github']}
  />
</AuthLayout>`,
    },
  ],
  api: [
    {
      title: 'AuthLayout',
      rows: [
        { name: 'brand', type: 'ReactNode', description: 'Logo / wordmark at the top.' },
        { name: 'title', type: 'ReactNode', required: true, description: 'Page heading.' },
        { name: 'subtitle', type: 'ReactNode', description: 'Subtitle under the heading.' },
        { name: 'footer', type: 'ReactNode', description: 'Footer area under the form (e.g. switch to sign-up).' },
        { name: 'children', type: 'ReactNode', required: true, description: 'The form itself.' },
      ],
    },
    {
      title: 'SignInForm',
      rows: [
        { name: 'onSubmit', type: '({ email, password }) => void | Promise<void>', required: true, description: 'Called on submit.' },
        { name: 'providers', type: `Array<'google' | 'github' | 'apple'>`, description: 'Social provider buttons.' },
        { name: 'loading', type: 'boolean', description: 'Disable + spinner during async submit.' },
        { name: 'error', type: 'ReactNode', description: 'Inline error banner above the form.' },
      ],
    },
  ],
};

export default doc;
