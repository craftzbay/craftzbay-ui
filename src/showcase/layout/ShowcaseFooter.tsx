import { routeToHash } from '../routing';

const VERSION = '0.7.1';
const GITHUB_URL = 'https://github.com/craftzbay/design-system';
const NPM_URL = 'https://www.npmjs.com/package/@craftzbay/ui';
const CHANGELOG_URL = `${GITHUB_URL}/blob/main/CHANGELOG.md`;

/**
 * Site-wide footer rendered on Home + all doc routes. Hidden on
 * full-bleed preview routes so it doesn't pollute template screenshots.
 */
export function ShowcaseFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="inline-flex size-5 items-center justify-center rounded-md bg-accent text-on-accent text-[10px]">
              ✦
            </span>
            @craftzbay/ui
          </div>
          <p className="max-w-xs text-xs text-foreground-muted">
            Refined-minimal Tailwind v4 + React design system. MIT-licensed.
          </p>
          <p className="text-[11px] text-foreground-subtle">
            © {year} craftzbay · v{VERSION}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs sm:grid-cols-3">
          <Column
            title="Docs"
            links={[
              { label: 'Components', href: `#${routeToHash({ kind: 'components-index' })}` },
              { label: 'Templates', href: `#${routeToHash({ kind: 'templates-index' })}` },
              { label: 'Guides', href: `#${routeToHash({ kind: 'guides-index' })}` },
            ]}
          />
          <Column
            title="Project"
            links={[
              { label: 'GitHub', href: GITHUB_URL, external: true },
              { label: 'npm', href: NPM_URL, external: true },
              { label: 'Releases', href: CHANGELOG_URL, external: true },
            ]}
          />
          <Column
            title="Resources"
            links={[
              { label: 'Quick start', href: `#${routeToHash({ kind: 'guide', slug: 'quickstart' })}` },
              { label: 'Theming', href: `#${routeToHash({ kind: 'guide', slug: 'theming' })}` },
              { label: 'Migration', href: `#${routeToHash({ kind: 'guide', slug: 'migration' })}` },
            ]}
          />
        </div>
      </div>
    </footer>
  );
}

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
        {title}
      </div>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              className="text-foreground-muted hover:text-foreground"
            >
              {l.label}
              {l.external && <span className="ml-0.5 text-foreground-subtle">↗</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
