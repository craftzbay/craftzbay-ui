import type { ComponentType } from 'react';
import {
  BarChart3,
  CreditCard,
  FileText,
  Folder,
  Home,
  Inbox,
  Settings as SettingsIcon,
  Users,
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

export function findNav(key: string): { section: NavSection; item: NavItem } | undefined {
  for (const section of NAV) {
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
