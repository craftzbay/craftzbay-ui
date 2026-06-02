import { lazy, Suspense, useState } from 'react';
import { ArrowLeft, Check, ChevronDown } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { getBlockMeta } from '../blocks/meta';
import { routeToHash } from '../routing';
import { ThemeToggle, BrandSwitcher } from '../theme/Controls';
import { NotFound } from './NotFound';

const BlockPreview = lazy(() => import('../blocks/Preview'));

/**
 * Standalone template preview — its own browser tab, no showcase navigation.
 * The template fills the viewport; the only chrome is a small floating dock at
 * the bottom: back-to-docs, a screen switcher (for layout-changing screens like
 * sign-in), and the live brand / theme controls.
 */
export function PreviewPage({ slug }: { slug: string }) {
  const doc = getBlockMeta(slug);
  const [screen, setScreen] = useState(() => doc?.screens[0]?.key ?? 'home');

  if (!doc) return <NotFound />;

  const activeScreen = doc.screens.find((s) => s.key === screen) ?? doc.screens[0];

  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <BlockPreview slug={slug} screen={screen} setScreen={setScreen} />
      </Suspense>

      {/* Floating control dock */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-background/90 p-1.5 shadow-lg backdrop-blur">
          <a
            href={`#${routeToHash({ kind: 'template', slug })}`}
            title="Back to docs"
            aria-label="Back to docs"
            className="inline-flex size-8 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </a>

          {doc.screens.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-foreground transition-colors hover:bg-background-muted"
                >
                  {activeScreen.label}
                  <ChevronDown className="size-3.5 opacity-60" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="top" sideOffset={8} className="w-44">
                <DropdownMenuLabel>Screen</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {doc.screens.map((s) => (
                  <DropdownMenuItem key={s.key} onSelect={() => setScreen(s.key)}>
                    <span>{s.label}</span>
                    {s.key === activeScreen.key && <Check className="ml-auto size-3.5 text-accent" aria-hidden />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <span className="h-4 w-px bg-border" aria-hidden />

          <BrandSwitcher compact />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
