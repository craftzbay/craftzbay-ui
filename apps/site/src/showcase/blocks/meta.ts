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
}

export const blockMeta: BlockMeta[] = [
  {
    slug: 'admin',
    name: 'Admin dashboard',
    description:
      'A complete admin app: collapsible sidebar driving Home, Projects, Inbox, Members, Insights and Settings pages, plus sign-in / sign-up screens. Everything is assembled from the library primitives.',
    useCases: ['SaaS back-office', 'Internal tools', 'Analytics console'],
    sourceFile: 'AdminTemplate.tsx',
    screens: [
      { key: 'app', label: 'Dashboard' },
      { key: 'signin', label: 'Sign in' },
      { key: 'signup', label: 'Sign up' },
    ],
  },
  {
    slug: 'landing',
    name: 'Landing page',
    description:
      'A complete SaaS marketing page — sticky nav, hero, logo strip, feature grid, pricing, testimonial and a closing CTA with footer — plus a matching sign-up screen.',
    useCases: ['Product marketing site', 'Startup landing', 'Pre-launch page'],
    sourceFile: 'LandingTemplate.tsx',
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
