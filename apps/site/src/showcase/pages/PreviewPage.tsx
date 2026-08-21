import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowLeft, Check, ChevronDown } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { blockMeta, getBlockMeta } from '../blocks/meta';
import { routeToHash } from '../routing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { ThemeToggle, BrandSwitcher } from '../theme/Controls';
import { NotFound } from './NotFound';

const BlockPreview = lazy(() => import('../blocks/Preview'));

/**
 * Standalone template preview — its own browser tab. The template owns the
 * full viewport (its own sticky navs behave exactly as they would in a real
 * app); a small floating dock at the bottom-right carries "back to docs" plus
 * the live accent + theme controls. Navigation between a template's screens
 * happens inside the template itself.
 */
export function PreviewPage({
  slug,
  initialScreen,
  initialVariant,
  initialPage,
}: {
  slug: string;
  initialScreen?: string;
  /** Layout variant key from the route (`#preview/<slug>/<screen>/<variant>`). */
  initialVariant?: string;
  /** In-app page for app shells (`#preview/<slug>/<screen>/<variant>/<page>`). */
  initialPage?: string;
}) {
  const doc = getBlockMeta(slug);
  const [screen, setScreen] = useState(
    () =>
      (initialScreen && doc?.screens.some((s) => s.key === initialScreen)
        ? initialScreen
        : doc?.screens[0]?.key) ?? 'home',
  );
  const [variant, setVariant] = useState<string | undefined>(() =>
    initialVariant && doc?.variants?.some((v) => v.key === initialVariant)
      ? initialVariant
      : doc?.variants?.[0]?.key,
  );
  // When the template page embeds this route in an iframe, the docs page
  // already owns the controls — hide the dock.
  const embedded = typeof window !== 'undefined' && window.self !== window.top;

  // Each template preview is its own tab — name it.
  useEffect(() => {
    if (doc) document.title = `${doc.name} — @craftzbay/ui`;
  }, [doc]);

  if (!doc) return <NotFound />;

  return (
    // App shells lock to the viewport so a leaking pane can never scroll the
    // document; page-style templates keep normal document scroll.
    <div
      className={cn('bg-background', doc.shell === 'app' ? 'h-dvh overflow-hidden' : 'min-h-dvh')}
    >
      <Suspense
        fallback={
          <div className="flex h-[60vh] items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <BlockPreview
          slug={slug}
          screen={screen}
          setScreen={setScreen}
          variant={variant}
          page={initialPage}
        />
      </Suspense>

      {/* Floating preview dock — bottom-right so the template renders edge to
          edge like a real deployment. */}
      {!embedded && (
        <div className="border-border bg-card fixed right-4 bottom-4 z-[var(--z-toast)] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-3 shadow-lg">
          <a
            href={`#${routeToHash({ kind: 'template', slug })}`}
            className="text-foreground-muted hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Docs
          </a>
          <span className="bg-border h-4 w-px" aria-hidden />
          {/* Template / screen switcher — jump between previews without going
            back through the docs. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="text-foreground-muted hover:bg-background-muted hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-7 min-w-0 items-center gap-1.5 rounded-full px-2 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label={`Template: ${doc.name}. Switch template or screen`}
              >
                <span className="bg-accent inline-flex size-1.5 rounded-full" aria-hidden />
                <span className="text-foreground max-w-[9rem] truncate font-medium">
                  {doc.name}
                </span>
                <ChevronDown className="size-3.5" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="center" className="min-w-56">
              <DropdownMenuLabel>Templates</DropdownMenuLabel>
              {blockMeta.map((b) => (
                <DropdownMenuItem
                  key={b.slug}
                  onSelect={() => {
                    window.location.hash = routeToHash({ kind: 'preview', slug: b.slug });
                  }}
                >
                  <span className="flex-1">{b.name}</span>
                  {b.slug === slug && <Check className="text-accent size-4" aria-hidden />}
                </DropdownMenuItem>
              ))}
              {doc.screens.length > 1 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{doc.name} screens</DropdownMenuLabel>
                  {doc.screens.map((sc) => (
                    <DropdownMenuItem key={sc.key} onSelect={() => setScreen(sc.key)}>
                      <span className="flex-1">{sc.label}</span>
                      {sc.key === screen && <Check className="text-accent size-4" aria-hidden />}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              {doc.variants && doc.variants.length > 1 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Layout</DropdownMenuLabel>
                  {doc.variants.map((v) => (
                    <DropdownMenuItem
                      key={v.key}
                      role="menuitemradio"
                      aria-checked={v.key === variant}
                      title={v.description}
                      onSelect={() => {
                        setVariant(v.key);
                        window.location.hash = routeToHash({
                          kind: 'preview',
                          slug,
                          screen,
                          variant: v.key,
                        });
                      }}
                    >
                      <span className="flex-1">{v.label}</span>
                      {v.key === variant && <Check className="text-accent size-4" aria-hidden />}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <BrandSwitcher />
          <ThemeToggle />
        </div>
      )}
    </div>
  );
}
