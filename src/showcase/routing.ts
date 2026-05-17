/**
 * Showcase routing — hash-based, two-segment.
 *
 *   #                       → home
 *   #components             → components index
 *   #components/button      → individual component doc
 *   #templates              → templates index
 *   #templates/auth-signin  → individual template page
 *   #guides                 → guides index
 *   #guides/theming         → individual guide
 *   #catalog                → legacy: full mini-demo wall
 *   #preview/auth-signin    → full-bleed live preview of a template
 */

export type Route =
  | { kind: 'home' }
  | { kind: 'catalog' }
  | { kind: 'components-index' }
  | { kind: 'component'; slug: string }
  | { kind: 'templates-index' }
  | { kind: 'template'; slug: string }
  | { kind: 'guides-index' }
  | { kind: 'guide'; slug: string }
  | { kind: 'preview'; slug: string };

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, '');
  if (!raw) return { kind: 'home' };

  if (raw === 'catalog') return { kind: 'catalog' };
  if (raw === 'components') return { kind: 'components-index' };
  if (raw === 'templates') return { kind: 'templates-index' };
  if (raw === 'guides' || raw === 'docs') return { kind: 'guides-index' };

  const [section, slug] = raw.split('/');
  if (section === 'components' && slug) return { kind: 'component', slug };
  if (section === 'templates' && slug) return { kind: 'template', slug };
  if ((section === 'guides' || section === 'docs') && slug) return { kind: 'guide', slug };
  if (section === 'preview' && slug) return { kind: 'preview', slug };

  // Back-compat: legacy single-segment hashes like #dashboard, #auth-signin,
  // #settings used to be top-level pattern keys. Map them to live previews.
  const legacy: Record<string, string> = {
    'auth-signin': 'auth-signin',
    'auth-signup': 'auth-signup',
    'auth-forgot': 'auth-forgot',
    'auth-magic': 'auth-magic',
    dashboard: 'dashboard',
    settings: 'settings',
    'data-table': 'data-table',
    record: 'record',
    onboarding: 'onboarding',
    pricing: 'pricing',
    'first-run': 'first-run',
  };
  if (legacy[raw]) return { kind: 'preview', slug: legacy[raw] };

  return { kind: 'home' };
}

export function routeToHash(route: Route): string {
  switch (route.kind) {
    case 'home':
      return '';
    case 'catalog':
      return 'catalog';
    case 'components-index':
      return 'components';
    case 'component':
      return `components/${route.slug}`;
    case 'templates-index':
      return 'templates';
    case 'template':
      return `templates/${route.slug}`;
    case 'guides-index':
      return 'guides';
    case 'guide':
      return `guides/${route.slug}`;
    case 'preview':
      return `preview/${route.slug}`;
  }
}

export function isFullBleedRoute(_route: Route): boolean {
  // Always render the showcase TopBar so users never get stranded inside a
  // template preview with no way back to the docs. Templates render below
  // the slim showcase header.
  return false;
}
