import type { ReactNode } from 'react';
import { AppShell, Dashboard } from './AppShell';
import {
  AuthLayout,
  ForgotPasswordForm,
  MagicLinkSent,
  SignInForm,
  SignUpForm,
} from './Authentication';
import { SettingsPage } from './Settings';
import { DataTablePage } from './DataTablePage';
import { RecordDetail } from './RecordDetail';
import { Onboarding } from './Onboarding';
import { Pricing } from './Pricing';
import { FirstRunEmpty } from './FirstRunEmpty';

// Raw source of each block file — Vite returns the file verbatim, so the
// "Code" tab can never drift from what actually renders. This is the artifact
// you copy: a complete page composed from @craftzbay/ui primitives.
import appShellSrc from './AppShell.tsx?raw';
import authSrc from './Authentication.tsx?raw';
import settingsSrc from './Settings.tsx?raw';
import dataTableSrc from './DataTablePage.tsx?raw';
import recordSrc from './RecordDetail.tsx?raw';
import onboardingSrc from './Onboarding.tsx?raw';
import pricingSrc from './Pricing.tsx?raw';
import firstRunSrc from './FirstRunEmpty.tsx?raw';

import { BrandMark } from '../components/BrandMark';

const noop = async () => {};
const brand = <BrandMark />;

export interface BlockDoc {
  slug: string;
  name: string;
  description: string;
  useCases: string[];
  /** Verbatim source of the block file — composed from @craftzbay/ui. */
  source: string;
  /** File the source comes from (shown as a hint + GitHub link). */
  sourceFile: string;
  /** Live, fully interactive preview. */
  render: () => ReactNode;
}

export const blockDocs: BlockDoc[] = [
  {
    slug: 'dashboard',
    name: 'Dashboard',
    description:
      'Application shell — sidebar + top bar + content — wrapping a stats / chart / activity overview. The whole page is assembled from Sidebar, TopNav, Card, Chart and Table primitives.',
    useCases: ['Admin dashboard', 'SaaS analytics home', 'Internal back-office'],
    source: appShellSrc,
    sourceFile: 'AppShell.tsx',
    render: () => (
      <AppShell brand={brand} active="home">
        <Dashboard />
      </AppShell>
    ),
  },
  {
    slug: 'data-table',
    name: 'Data table page',
    description:
      'Filter bar + search + bulk-action toolbar + DataGrid + Pagination. Generic over your row type — pass columns and rows.',
    useCases: ['Project list', 'User management', 'Audit log'],
    source: dataTableSrc,
    sourceFile: 'DataTablePage.tsx',
    render: () => <DataTablePage />,
  },
  {
    slug: 'settings',
    name: 'Settings',
    description:
      'Two-column settings layout: sticky sub-nav on the left, scrolling sections on the right. Sections are plain data — add or remove without touching the layout.',
    useCases: ['User account settings', 'Workspace settings', 'Project settings'],
    source: settingsSrc,
    sourceFile: 'Settings.tsx',
    render: () => <SettingsPage />,
  },
  {
    slug: 'record',
    name: 'Record detail',
    description:
      'Header with title + metadata + actions, Tabs for related views, and an optional side panel. Use for any "thing detail" page — user, project, ticket, order.',
    useCases: ['User profile', 'Project overview', 'Ticket detail', 'Order detail'],
    source: recordSrc,
    sourceFile: 'RecordDetail.tsx',
    render: () => <RecordDetail />,
  },
  {
    slug: 'onboarding',
    name: 'Onboarding wizard',
    description:
      'Multi-step Stepper flow with one card per step. Steps are declared as data; the block handles navigation and per-step state.',
    useCases: ['New user setup', 'Workspace creation flow', 'Integration setup wizard'],
    source: onboardingSrc,
    sourceFile: 'Onboarding.tsx',
    render: () => <Onboarding />,
  },
  {
    slug: 'first-run',
    name: 'First-run empty',
    description:
      'Welcoming empty state — hero + three next-step action cards. Use as the first screen of a brand-new workspace or project.',
    useCases: ['New workspace landing', 'Empty project home', 'Post-signup welcome'],
    source: firstRunSrc,
    sourceFile: 'FirstRunEmpty.tsx',
    render: () => <FirstRunEmpty />,
  },
  {
    slug: 'pricing',
    name: 'Pricing',
    description:
      'Three-tier comparison grid with feature lists and CTAs. Tiers are declared as data — change copy or add a tier without touching the layout.',
    useCases: ['Marketing pricing page', 'In-app upgrade flow'],
    source: pricingSrc,
    sourceFile: 'Pricing.tsx',
    render: () => <Pricing />,
  },
  {
    slug: 'auth-signin',
    name: 'Sign in',
    description:
      'Centered sign-in card with email + password, built on the AuthLayout split-screen shell and the Form primitives.',
    useCases: ['Customer SaaS sign-in page', 'Internal admin login'],
    source: authSrc,
    sourceFile: 'Authentication.tsx',
    render: () => (
      <AuthLayout brand={brand} title="Sign in" subtitle="Welcome back. Sign in to continue.">
        <SignInForm onSubmit={noop} />
      </AuthLayout>
    ),
  },
  {
    slug: 'auth-signup',
    name: 'Sign up',
    description:
      'Account-creation form with email + password and terms acceptance — the same shape as Sign in.',
    useCases: ['New customer account creation', 'Internal user onboarding'],
    source: authSrc,
    sourceFile: 'Authentication.tsx',
    render: () => (
      <AuthLayout brand={brand} title="Create your account" subtitle="Start free, no credit card.">
        <SignUpForm onSubmit={noop} />
      </AuthLayout>
    ),
  },
  {
    slug: 'auth-forgot',
    name: 'Forgot password',
    description: 'Single-field "enter your email" form to request a password-reset link.',
    useCases: ['Password reset request'],
    source: authSrc,
    sourceFile: 'Authentication.tsx',
    render: () => (
      <AuthLayout brand={brand} title="Forgot password?" subtitle="We'll email you a reset link.">
        <ForgotPasswordForm onSubmit={noop} />
      </AuthLayout>
    ),
  },
  {
    slug: 'auth-magic',
    name: 'Magic link sent',
    description:
      'Post-submit confirmation screen for magic-link / password-reset flows — tells the user to check their inbox.',
    useCases: ['After magic-link sign-in', 'After password reset email'],
    source: authSrc,
    sourceFile: 'Authentication.tsx',
    render: () => (
      <AuthLayout brand={brand} title="Check your inbox" subtitle="We sent a magic link to your email.">
        <MagicLinkSent email="you@example.com" />
      </AuthLayout>
    ),
  },
];

export function getBlockDoc(slug: string): BlockDoc | undefined {
  return blockDocs.find((b) => b.slug === slug);
}
