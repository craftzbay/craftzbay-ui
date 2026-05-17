import { Moon, Sun } from '@/icons';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/utils';
import { routeToHash, type Route } from '../routing';

interface ShowcaseTopBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenPalette: () => void;
  current: Route;
}

const NAV: { label: string; route: Route; matchKinds: Route['kind'][] }[] = [
  { label: 'Components', route: { kind: 'components-index' }, matchKinds: ['components-index', 'component'] },
  { label: 'Templates', route: { kind: 'templates-index' }, matchKinds: ['templates-index', 'template'] },
  { label: 'Guides', route: { kind: 'guides-index' }, matchKinds: ['guides-index', 'guide'] },
];

const GITHUB_URL = 'https://github.com/craftzbay/design-system';
const NPM_URL = 'https://www.npmjs.com/package/@craftzbay/ui';

/**
 * Persistent top bar shared by Home + docs pages. Hidden in full-bleed
 * preview routes (templates rendered for screenshot / live use).
 */
export function ShowcaseTopBar({
  theme,
  onToggleTheme,
  onOpenPalette,
  current,
}: ShowcaseTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-6">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-accent text-on-accent text-xs">
            ✦
          </span>
          @craftzbay/ui
        </a>

        <nav className="hidden items-center gap-1 text-sm text-foreground-muted sm:flex">
          {NAV.map((item) => {
            const active = item.matchKinds.includes(current.kind);
            return (
              <a
                key={item.label}
                href={`#${routeToHash(item.route)}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 transition-colors',
                  active
                    ? 'text-foreground'
                    : 'hover:bg-background-muted hover:text-foreground',
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden h-8 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-sm text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground sm:flex"
          >
            <span className="text-xs">Search…</span>
            <span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground-subtle">
              ⌘K
            </span>
          </button>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md p-1.5 text-foreground-muted hover:bg-background-muted hover:text-foreground sm:inline-flex"
            aria-label="GitHub repository"
          >
            <GithubGlyph />
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md p-1.5 text-foreground-muted hover:bg-background-muted hover:text-foreground sm:inline-flex"
            aria-label="npm package"
          >
            <NpmGlyph />
          </a>

          <IconButton
            aria-label="Toggle theme"
            icon={theme === 'light' ? <Moon /> : <Sun />}
            size="sm"
            variant="ghost"
            onClick={onToggleTheme}
          />
        </div>
      </div>
    </header>
  );
}

function GithubGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.07c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.04 1.78 2.72 1.26 3.38.97.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17.92-.26 1.91-.39 2.9-.39s1.98.13 2.9.39c2.21-1.48 3.18-1.17 3.18-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.35.78 1.03.78 2.08v3.08c0 .31.21.67.8.55C20.21 21.4 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function NpmGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M3 3v18h6V9h6v12h6V3H3zm12 6h-3v6h3V9z" />
    </svg>
  );
}
