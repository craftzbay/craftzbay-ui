import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'auth-magic',
  name: 'Magic link sent',
  description: 'Post-submit confirmation screen for magic-link / password-reset flows. Tells the user to check their inbox.',
  exports: ['AuthLayout', 'MagicLinkSent'],
  sourceFile: 'Authentication.tsx',
  previewSlug: 'auth-magic',
  useCases: ['After magic-link sign-in', 'After password reset email'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/auth-magic">full-page preview ↗</a>.
        </div>
      ),
      code: `<AuthLayout brand={<Logo />} title="Check your inbox">
  <MagicLinkSent email="you@company.com" onResend={() => api.resend()} />
</AuthLayout>`,
    },
  ],
};

export default doc;
