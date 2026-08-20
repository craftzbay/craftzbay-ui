/**
 * Template metadata — lightweight, safe to import anywhere (home, sidebar,
 * command palette). The rendered template loads lazily from ./Preview and its
 * source from ./sources.
 *
 * A template is a complete, multi-page product (ThemeForest-style). Pages that
 * share a chrome (a dashboard's sidebar, a site's top nav) switch inside the
 * template; pages whose whole layout changes (sign-in, cart, …) are exposed as
 * `screens` and switched from the floating dock in the preview.
 */
import type { ReactNode } from 'react';

export interface TemplateScreen {
  key: string;
  label: string;
}

/** Props every template component receives from the preview host. */
export interface TemplateProps {
  /** Active top-level screen key. */
  screen: string;
  /** Switch the top-level screen (also driven by the dock). */
  setScreen: (screen: string) => void;
  /** Wordmark to render in the template's chrome. */
  brand: ReactNode;
}

export interface BlockMeta {
  slug: string;
  name: string;
  description: string;
  useCases: string[];
  sourceFile: string;
  /** Top-level screens, switched from the preview dock. First is the default. */
  screens: TemplateScreen[];
  /** Design patterns the template demonstrates (design-research section names). */
  patterns?: string[];
}

export const blockMeta: BlockMeta[] = [
  {
    slug: 'admin',
    name: 'Admin dashboard',
    description:
      'A complete admin app on the library Sidebar + TopNav shell: workspace switcher, ⌘K palette, Overview KPIs and charts, Projects (sortable, filterable, paginated CRUD with bulk actions), Inbox, Team, Reports and Settings.',
    useCases: ['SaaS back-office', 'Internal tools', 'Analytics console'],
    sourceFile: 'AdminDashboard.tsx',
    screens: [{ key: 'app', label: 'Dashboard' }],
    patterns: [
      'App shell — 256px sidebar, icon rail, drawer ≤1024px (10 · App shell)',
      'Active nav = accent bar + weight + background; breadcrumbs at depth ≥2 (10 · Navigation)',
      'Overview: KPI row → chart → table; delta with arrow + sign + period (11 · KPI tile)',
      'Table: 3-state sort, filter chips, 300ms search, 25/50/100 pages, bulk bar, overflow actions (10 · Table)',
      'Destructive actions confirm with the verb on the button (10 · Destructive)',
      'First-run vs filtered empty state; skeleton loading (10 · Empty states)',
      '⌘K palette, `/` search, Esc, tenant name in the top bar (10 · Keyboard · Multi-tenant)',
    ],
  },
  {
    slug: 'auth',
    name: 'Authentication',
    description:
      'The full auth flow on a single centred card — SSO buttons, sign in, sign up, forgot password and the magic-link confirmation. Switch screens from the preview dock.',
    useCases: ['App login', 'Customer sign-up', 'Password reset flow'],
    sourceFile: 'AuthTemplate.tsx',
    patterns: [
      'Single column, 400px card, centred; brand above, switch link below (10 · Auth pages)',
      'SSO buttons above the form with an “or” divider (10 · Auth pages)',
      'Label above field, ≤3 fields, errors below via aria-describedby (13 · Components)',
    ],
    screens: [
      { key: 'signin', label: 'Sign in' },
      { key: 'signup', label: 'Sign up' },
      { key: 'forgot', label: 'Forgot password' },
      { key: 'magic', label: 'Magic link' },
    ],
  },
  {
    slug: 'landing',
    name: 'Landing page',
    description:
      'A complete SaaS marketing page — sticky nav, hero, logo strip, feature grid, how-it-works steps, pricing, testimonial, FAQ and a closing CTA with footer — plus a matching sign-up screen.',
    useCases: ['Product marketing site', 'Startup landing', 'Pre-launch page'],
    sourceFile: 'LandingTemplate.tsx',
    patterns: [
      'Page anatomy: nav → hero → proof → features → how it works → pricing → testimonial → FAQ → CTA → footer (12 · Anatomy)',
      'One h1, one primary CTA label repeated 4× (12 · CTA hierarchy)',
      'Sections separated by background alternation, not rules (12 · Section rhythm)',
      'Logo strip greyscale, uniform height (12 · Social proof)',
      'FAQ as native <details> (12 · FAQ)',
      'Pricing ≤4 plans, one recommended, tabular prices (12 · Pricing table)',
    ],
    screens: [
      { key: 'home', label: 'Landing' },
      { key: 'signup', label: 'Sign up' },
    ],
  },
  {
    slug: 'news',
    name: 'News / magazine',
    description:
      'A publication front page and article reader: masthead with category nav, lead story, a grid of latest articles, a sidebar of trending posts, and a full article layout.',
    useCases: ['News site', 'Company blog', 'Magazine / editorial'],
    sourceFile: 'NewsTemplate.tsx',
    patterns: [
      'Masthead with ≤7 categories, lead story + grid, 65ch reading column (02 · Typography)',
      'Image boxes reserve their aspect ratio — no layout shift (04 · Visual details)',
      'Client-side search and category filter with an empty state (10 · Empty states)',
    ],
    screens: [
      { key: 'home', label: 'Front page' },
      { key: 'article', label: 'Article' },
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    description:
      'A storefront flow: a filterable product grid, a product detail page with gallery and add-to-cart, and a cart / checkout summary — all sharing a shop header.',
    useCases: ['Online store', 'Product catalog', 'Marketplace'],
    sourceFile: 'EcommerceTemplate.tsx',
    patterns: [
      'Filterable catalogue grid with persistent header + cart count badge (06 · Components)',
      'Product detail: gallery, price in tabular-nums, single primary action (06 · Buttons)',
      'Cart with quantity steppers and a sticky order summary (03 · Spacing & layout)',
    ],
    screens: [
      { key: 'shop', label: 'Shop' },
      { key: 'product', label: 'Product' },
      { key: 'cart', label: 'Cart' },
    ],
  },
];

export function getBlockMeta(slug: string): BlockMeta | undefined {
  return blockMeta.find((b) => b.slug === slug);
}
