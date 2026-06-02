import { lazy, Suspense, useState } from 'react';
import { ArrowLeft } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import { getBlockMeta } from '../blocks/meta';
import { routeToHash } from '../routing';
import { ThemeToggle, BrandSwitcher } from '../theme/Controls';
import { NotFound } from './NotFound';

const BlockPreview = lazy(() => import('../blocks/Preview'));

/**
 * Standalone template preview — its own browser tab. A slim top bar carries
 * "back to docs" plus the live accent + theme controls; navigation between a
 * template's screens happens inside the template itself.
 */
export function PreviewPage({ slug }: { slug: string }) {
  const doc = getBlockMeta(slug);
  const [screen, setScreen] = useState(() => doc?.screens[0]?.key ?? 'home');

  if (!doc) return <NotFound />;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-11 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur">
        <a
          href={`#${routeToHash({ kind: 'template', slug })}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Docs
        </a>
        <span className="h-4 w-px bg-border" aria-hidden />
        <span className="flex items-center gap-2 text-xs text-foreground-muted">
          <span className="inline-flex size-1.5 rounded-full bg-accent" aria-hidden />
          Live preview · <span className="font-medium text-foreground">{doc.name}</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <BrandSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1">
        <Suspense
          fallback={
            <div className="flex h-[60vh] items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <BlockPreview slug={slug} screen={screen} setScreen={setScreen} />
        </Suspense>
      </div>
    </div>
  );
}
