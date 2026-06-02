/**
 * Lightweight block metadata — safe to import anywhere (home, sidebar, command
 * palette) without pulling in the block components or their source text. The
 * heavy parts load on demand: the rendered preview from ./Preview (React.lazy)
 * and the verbatim source from ./sources (dynamic import).
 */
export interface BlockMeta {
  slug: string;
  name: string;
  description: string;
  useCases: string[];
  /** File the source comes from (shown as a hint + GitHub link). */
  sourceFile: string;
}

export const blockMeta: BlockMeta[] = [
  {
    slug: 'dashboard',
    name: 'Dashboard',
    description:
      'Application shell — sidebar + top bar + content — wrapping a stats / chart / activity overview. The whole page is assembled from Sidebar, TopNav, Card, Chart and Table primitives.',
    useCases: ['Admin dashboard', 'SaaS analytics home', 'Internal back-office'],
    sourceFile: 'AppShell.tsx',
  },
  {
    slug: 'data-table',
    name: 'Data table page',
    description:
      'Filter bar + search + bulk-action toolbar + DataGrid + Pagination. Generic over your row type — pass columns and rows.',
    useCases: ['Project list', 'User management', 'Audit log'],
    sourceFile: 'DataTablePage.tsx',
  },
  {
    slug: 'settings',
    name: 'Settings',
    description:
      'Two-column settings layout: sticky sub-nav on the left, scrolling sections on the right. Sections are plain data — add or remove without touching the layout.',
    useCases: ['User account settings', 'Workspace settings', 'Project settings'],
    sourceFile: 'Settings.tsx',
  },
  {
    slug: 'record',
    name: 'Record detail',
    description:
      'Header with title + metadata + actions, Tabs for related views, and an optional side panel. Use for any "thing detail" page — user, project, ticket, order.',
    useCases: ['User profile', 'Project overview', 'Ticket detail', 'Order detail'],
    sourceFile: 'RecordDetail.tsx',
  },
  {
    slug: 'onboarding',
    name: 'Onboarding wizard',
    description:
      'Multi-step Stepper flow with one card per step. Steps are declared as data; the block handles navigation and per-step state.',
    useCases: ['New user setup', 'Workspace creation flow', 'Integration setup wizard'],
    sourceFile: 'Onboarding.tsx',
  },
  {
    slug: 'first-run',
    name: 'First-run empty',
    description:
      'Welcoming empty state — hero + three next-step action cards. Use as the first screen of a brand-new workspace or project.',
    useCases: ['New workspace landing', 'Empty project home', 'Post-signup welcome'],
    sourceFile: 'FirstRunEmpty.tsx',
  },
  {
    slug: 'pricing',
    name: 'Pricing',
    description:
      'Three-tier comparison grid with feature lists and CTAs. Tiers are declared as data — change copy or add a tier without touching the layout.',
    useCases: ['Marketing pricing page', 'In-app upgrade flow'],
    sourceFile: 'Pricing.tsx',
  },
  {
    slug: 'auth-signin',
    name: 'Sign in',
    description:
      'Centered sign-in card with email + password, built on the AuthLayout split-screen shell and the Form primitives.',
    useCases: ['Customer SaaS sign-in page', 'Internal admin login'],
    sourceFile: 'Authentication.tsx',
  },
  {
    slug: 'auth-signup',
    name: 'Sign up',
    description:
      'Account-creation form with email + password and terms acceptance — the same shape as Sign in.',
    useCases: ['New customer account creation', 'Internal user onboarding'],
    sourceFile: 'Authentication.tsx',
  },
  {
    slug: 'auth-forgot',
    name: 'Forgot password',
    description: 'Single-field "enter your email" form to request a password-reset link.',
    useCases: ['Password reset request'],
    sourceFile: 'Authentication.tsx',
  },
  {
    slug: 'auth-magic',
    name: 'Magic link sent',
    description:
      'Post-submit confirmation screen for magic-link / password-reset flows — tells the user to check their inbox.',
    useCases: ['After magic-link sign-in', 'After password reset email'],
    sourceFile: 'Authentication.tsx',
  },
];

export function getBlockMeta(slug: string): BlockMeta | undefined {
  return blockMeta.find((b) => b.slug === slug);
}
