import type { ComponentType } from 'react';
import {
  BarChart3,
  ChartPie,
  CreditCard,
  File,
  FileText,
  Folder,
  Handshake,
  Home,
  ImageIcon,
  Inbox,
  Kanban,
  Key,
  LayoutGrid,
  Lock,
  MessageSquare,
  Receipt,
  Settings as SettingsIcon,
  Tags,
  User,
  Users,
  Wallet,
} from '@/icons';

/* =============================================================================
 *  Admin template — demo data. Everything the pages render comes from here so
 *  the UI files stay about structure, not fixtures.
 * ========================================================================== */

export interface NavItem {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
}
export interface NavSection {
  label: string;
  items: NavItem[];
}

/** ≤7 top-level items, grouped. `overview` is the home page (no breadcrumb). */
export const NAV: NavSection[] = [
  {
    label: 'General',
    items: [
      { key: 'overview', label: 'Overview', icon: Home },
      { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { key: 'projects', label: 'Projects', icon: Folder },
      { key: 'inbox', label: 'Inbox', icon: Inbox, count: 2 },
      { key: 'members', label: 'Team', icon: Users },
      { key: 'reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    label: 'Account',
    items: [
      { key: 'settings', label: 'Settings', icon: SettingsIcon },
      { key: 'billing', label: 'Billing', icon: CreditCard },
    ],
  },
];

/**
 * Top-level modules for the `dual` (icon rail + panel) shell. The rail lists
 * modules; the panel shows the active module's sections. `Workspace` reuses
 * the NAV sections verbatim and `Admin` its Account section; the rest are the
 * back-office areas a product with many surfaces grows into. Page keys are
 * unique across modules — `findModule` relies on it.
 */
export interface NavModule {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  sections: NavSection[];
}

export const MODULES: NavModule[] = [
  { key: 'workspace', label: 'Workspace', icon: LayoutGrid, sections: NAV.slice(0, 2) },
  {
    key: 'crm',
    label: 'CRM',
    icon: Users,
    sections: [
      {
        label: 'Sales',
        items: [
          { key: 'customers', label: 'Customers', icon: User },
          { key: 'deals', label: 'Deals', icon: Handshake, count: 3 },
          { key: 'pipeline', label: 'Pipeline', icon: Kanban },
        ],
      },
      { label: 'Audience', items: [{ key: 'segments', label: 'Segments', icon: Tags }] },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: Wallet,
    sections: [
      {
        label: 'Money',
        items: [
          { key: 'invoices', label: 'Invoices', icon: Receipt },
          { key: 'payments', label: 'Payments', icon: CreditCard },
        ],
      },
      { label: 'Insights', items: [{ key: 'fin-reports', label: 'Reports', icon: ChartPie }] },
    ],
  },
  {
    key: 'content',
    label: 'Content',
    icon: FileText,
    sections: [
      {
        label: 'Library',
        items: [
          { key: 'pages', label: 'Pages', icon: File },
          { key: 'media', label: 'Media', icon: ImageIcon },
        ],
      },
      {
        label: 'Community',
        items: [{ key: 'comments', label: 'Comments', icon: MessageSquare, count: 5 }],
      },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: Lock,
    sections: [
      NAV[2],
      {
        label: 'Security',
        items: [
          { key: 'audit', label: 'Audit log', icon: FileText },
          { key: 'roles', label: 'Roles', icon: Users },
          { key: 'apikeys', label: 'API keys', icon: Key },
        ],
      },
    ],
  },
];

/**
 * Pages that exist only as destinations (no full demo UI yet). Rendered by
 * `StubPage` with a breadcrumb and a descriptive empty state. (`apikeys` is
 * deliberately absent — it renders the permission-denied state instead.)
 */
export interface StubSpec {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: ComponentType<{ className?: string }>;
}
export const STUB_PAGES: Record<string, StubSpec> = {
  customers: {
    title: 'Customers',
    subtitle: 'Every account that has signed up or been imported.',
    emptyTitle: 'No customers yet',
    emptyDescription: 'Import a CSV or connect your billing provider to see accounts here.',
    icon: User,
  },
  deals: {
    title: 'Deals',
    subtitle: 'Open opportunities and their owners.',
    emptyTitle: 'No open deals',
    emptyDescription: 'Deals you or your team create will be tracked here with stage and value.',
    icon: Handshake,
  },
  pipeline: {
    title: 'Pipeline',
    subtitle: 'Deals by stage, from lead to closed.',
    emptyTitle: 'Pipeline is empty',
    emptyDescription: 'Add a deal to see it move across Lead, Qualified, Proposal and Won.',
    icon: Kanban,
  },
  segments: {
    title: 'Segments',
    subtitle: 'Saved customer filters for campaigns and reports.',
    emptyTitle: 'No segments',
    emptyDescription: 'Save a customer filter to reuse it in campaigns and exports.',
    icon: Tags,
  },
  invoices: {
    title: 'Invoices',
    subtitle: 'Issued, paid and overdue invoices.',
    emptyTitle: 'No invoices',
    emptyDescription: 'Invoices are generated automatically at the start of each billing cycle.',
    icon: Receipt,
  },
  payments: {
    title: 'Payments',
    subtitle: 'Incoming payments and payouts.',
    emptyTitle: 'No payments recorded',
    emptyDescription: 'Connect a payment provider to reconcile transactions here.',
    icon: CreditCard,
  },
  'fin-reports': {
    title: 'Reports',
    subtitle: 'Revenue, churn and cash-flow summaries.',
    emptyTitle: 'No reports yet',
    emptyDescription: 'Monthly revenue and churn reports appear after the first billing cycle.',
    icon: ChartPie,
  },
  pages: {
    title: 'Pages',
    subtitle: 'Published and draft pages.',
    emptyTitle: 'No pages',
    emptyDescription: 'Create a page to publish it on your site or docs portal.',
    icon: File,
  },
  media: {
    title: 'Media',
    subtitle: 'Images, video and files used across pages.',
    emptyTitle: 'Library is empty',
    emptyDescription: 'Upload images or files to reuse them in pages and posts.',
    icon: ImageIcon,
  },
  comments: {
    title: 'Comments',
    subtitle: 'Moderation queue for reader comments.',
    emptyTitle: 'Nothing to moderate',
    emptyDescription: 'New comments wait here until approved or removed.',
    icon: MessageSquare,
  },
  audit: {
    title: 'Audit log',
    subtitle: 'Who did what, and when.',
    emptyTitle: 'No events yet',
    emptyDescription: 'Sign-ins, permission changes and exports will be listed here.',
    icon: FileText,
  },
  roles: {
    title: 'Roles',
    subtitle: 'Permission sets assigned to members.',
    emptyTitle: 'Default roles only',
    emptyDescription:
      'Owner, Admin, Member and Viewer are built in. Custom roles arrive with the Enterprise plan.',
    icon: Lock,
  },
};

/** Every section across modules — the `dual` shell's palette and breadcrumbs read this. */
export const ALL_SECTIONS: NavSection[] = MODULES.flatMap((m) => m.sections);

/** Module that owns a page (unknown keys → the first module). */
export function findModule(pageKey: string): NavModule {
  return (
    MODULES.find((m) => m.sections.some((s) => s.items.some((i) => i.key === pageKey))) ??
    MODULES[0]
  );
}

export function findNav(key: string): { section: NavSection; item: NavItem } | undefined {
  for (const section of ALL_SECTIONS) {
    const item = section.items.find((i) => i.key === key);
    if (item) return { section, item };
  }
  return undefined;
}

export const USER = { name: 'Alex Morgan', email: 'alex@example.com', initials: 'AM' };

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  initial: string;
}
export const WORKSPACES: Workspace[] = [
  { id: 'acme', name: 'Acme Inc', plan: 'Team', initial: 'A' },
  { id: 'northwind', name: 'Northwind', plan: 'Enterprise', initial: 'N' },
  { id: 'globex', name: 'Globex', plan: 'Free', initial: 'G' },
];

/* ---------------------------------------------------------------------------
 *  Charts
 * ------------------------------------------------------------------------ */

export const SERIES_A = Array.from({ length: 30 }, (_, i) => ({
  x: `Day ${i + 1}`,
  y: Math.round(2200 + i * 22 + Math.sin(i / 3.5) * 180 + Math.cos(i * 3.1) * 60),
}));
export const SERIES_B = Array.from({ length: 30 }, (_, i) => ({
  x: `Day ${i + 1}`,
  y: Math.round(1400 + i * 14 + Math.sin(i / 2.5) * 220 + Math.cos(i * 5) * 70),
}));
export const CHANNELS = [
  { x: 'Direct', y: 4200 },
  { x: 'Search', y: 3100 },
  { x: 'Social', y: 2400 },
  { x: 'Email', y: 1800 },
  { x: 'Referral', y: 1200 },
];

export const ACTIVITY = [
  {
    id: '1',
    who: 'Anu B.',
    initials: 'AB',
    action: 'merged',
    target: 'feat/segments',
    when: '12m ago',
  },
  {
    id: '2',
    who: 'Bat E.',
    initials: 'BE',
    action: 'opened',
    target: 'fix/login-flow',
    when: '34m ago',
  },
  {
    id: '3',
    who: 'Tuya G.',
    initials: 'TG',
    action: 'commented on',
    target: 'Q2 OKRs',
    when: '1h ago',
  },
  {
    id: '4',
    who: 'Khulan O.',
    initials: 'KO',
    action: 'archived',
    target: 'old-billing-spike',
    when: '3h ago',
  },
];

/* ---------------------------------------------------------------------------
 *  Projects
 * ------------------------------------------------------------------------ */

export type ProjectStatus = 'Active' | 'In review' | 'Blocked' | 'Archived';

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  owner: string;
  /** ISO date — sortable; rendered relative with the absolute in `title`. */
  updatedAt: string;
}

export const STATUSES: ProjectStatus[] = ['Active', 'In review', 'Blocked', 'Archived'];

export const STATUS_TONE: Record<ProjectStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Active: 'success',
  'In review': 'warning',
  Blocked: 'danger',
  Archived: 'neutral',
};

const OWNERS = ['Anu B.', 'Bat E.', 'Tuya G.', 'Khulan O.', 'Sara K.', 'Mark R.'];
const NAMES = [
  'Aurora web',
  'Billing v2',
  'Mobile beta',
  'Data pipeline',
  'Design system',
  'Legacy import',
  'Search revamp',
  'Onboarding flow',
  'Audit logging',
  'Marketing site',
  'API gateway',
  'Usage metering',
  'SSO rollout',
  'Webhooks',
  'Notifications v3',
  'Exports',
  'Permissions matrix',
  'Status page',
  'Rate limiting',
  'Sandbox env',
  'CLI',
  'Docs portal',
  'Partner API',
  'Invoice PDFs',
  'Uptime monitor',
  'Feature flags',
  'Session replay',
  'Bulk import',
  'Team spaces',
  'Dark mode',
  'Mobile push',
  'Workflow builder',
];

/** 32 rows — enough to exercise page size 25 and a second page. */
export const SEED_PROJECTS: Project[] = NAMES.map((name, i) => {
  const d = new Date(Date.UTC(2026, 7, 20, 9, 0, 0));
  d.setUTCHours(d.getUTCHours() - i * 7 - (i % 3) * 2);
  return {
    id: i + 1,
    name,
    status: STATUSES[(i * 7) % STATUSES.length],
    owner: OWNERS[(i * 5) % OWNERS.length],
    updatedAt: d.toISOString(),
  };
});

/** Relative label for a timestamp, with the absolute date for `title`. */
export function formatRelative(
  iso: string,
  now = Date.UTC(2026, 7, 20, 10, 0, 0),
): { label: string; title: string } {
  const diffMin = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  const title = iso.slice(0, 16).replace('T', ' ');
  if (diffMin < 60) return { label: `${diffMin}m ago`, title };
  const h = Math.round(diffMin / 60);
  if (h < 24) return { label: `${h}h ago`, title };
  const days = Math.round(h / 24);
  if (days < 7) return { label: `${days}d ago`, title };
  return { label: `${Math.round(days / 7)}w ago`, title };
}

/* ---------------------------------------------------------------------------
 *  Inbox · Team · Billing · Notifications
 * ------------------------------------------------------------------------ */

export interface Message {
  id: number;
  from: string;
  initials: string;
  subject: string;
  preview: string;
  when: string;
  unread: boolean;
}
export const SEED_MESSAGES: Message[] = [
  {
    id: 1,
    from: 'Anu Bold',
    initials: 'AB',
    subject: 'Re: Q2 roadmap',
    preview: 'Pushed the segment work to next sprint.',
    when: '12m',
    unread: true,
  },
  {
    id: 2,
    from: 'Bat Erdene',
    initials: 'BE',
    subject: 'Login flow fix is live',
    preview: 'Error rate is already back down.',
    when: '1h',
    unread: true,
  },
  {
    id: 3,
    from: 'Tuya Ganbat',
    initials: 'TG',
    subject: 'Design review notes',
    preview: 'A few spacing tweaks on the pricing page.',
    when: '3h',
    unread: false,
  },
  {
    id: 4,
    from: 'Khulan O.',
    initials: 'KO',
    subject: 'Invoice #2041',
    preview: 'Approved and scheduled for the 1st.',
    when: 'Yesterday',
    unread: false,
  },
  {
    id: 5,
    from: 'Sara Khan',
    initials: 'SK',
    subject: 'Welcome to the team!',
    preview: 'Everything to get set up.',
    when: '2d',
    unread: false,
  },
];

export interface Member {
  id: number;
  name: string;
  email: string;
  initials: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Billing';
  status: 'Active' | 'Invited';
}
export const ROLES: Member['role'][] = ['Owner', 'Admin', 'Member', 'Billing'];
export const SEED_MEMBERS: Member[] = [
  {
    id: 1,
    name: 'Anu Bold',
    email: 'anu@example.com',
    initials: 'AB',
    role: 'Owner',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Bat Erdene',
    email: 'bat@example.com',
    initials: 'BE',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Tuya Ganbat',
    email: 'tuya@example.com',
    initials: 'TG',
    role: 'Member',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Khulan O.',
    email: 'khulan@example.com',
    initials: 'KO',
    role: 'Member',
    status: 'Invited',
  },
  {
    id: 5,
    name: 'Sara Khan',
    email: 'sara@example.com',
    initials: 'SK',
    role: 'Billing',
    status: 'Active',
  },
];

export const INVOICES = [
  { id: 'INV-2041', date: '2026-06-01', amount: '$240.00', status: 'Paid' },
  { id: 'INV-2032', date: '2026-05-01', amount: '$240.00', status: 'Paid' },
  { id: 'INV-2018', date: '2026-04-01', amount: '$240.00', status: 'Paid' },
];

export const NOTIFICATIONS = [
  {
    id: 1,
    who: 'Anu B.',
    initials: 'AB',
    text: 'mentioned you in Q2 OKRs',
    when: '2m',
    unread: true,
  },
  {
    id: 2,
    who: 'Bat E.',
    initials: 'BE',
    text: 'requested review on fix/login-flow',
    when: '18m',
    unread: true,
  },
  {
    id: 3,
    who: 'Tuya G.',
    initials: 'TG',
    text: 'commented on feat/segments',
    when: '1h',
    unread: false,
  },
];
