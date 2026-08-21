import { useState } from 'react';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/use-media-query';
import { useModifierKey } from '@/hooks/use-modifier-key';
import { useFieldIds } from '@/hooks/use-field-ids';
import { useDebounce } from '@/hooks/use-debounce';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Kbd } from '@/components/ui/Kbd';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ComponentDoc } from '../registry/types';

function MediaQueryDemo() {
  const wide = useMediaQuery('(min-width: 768px)');
  const reduced = usePrefersReducedMotion();
  return (
    <div className="flex flex-wrap gap-2">
      <Badge tone={wide ? 'success' : 'neutral'} dot>
        {wide ? '≥ 768px' : '< 768px'}
      </Badge>
      <Badge tone={reduced ? 'warning' : 'neutral'} dot>
        {reduced ? 'reduced motion' : 'motion ok'}
      </Badge>
    </div>
  );
}

function ModifierDemo() {
  const mod = useModifierKey();
  return (
    <span className="flex items-center gap-1 text-sm">
      Search <Kbd>{mod.symbol}</Kbd>
      <Kbd>K</Kbd>
      <span className="text-foreground-subtle ml-2 text-xs">aria: “{mod.label}+K”</span>
    </span>
  );
}

function DebounceDemo() {
  const [q, setQ] = useState('');
  const debounced = useDebounce(q, 400);
  return (
    <div className="w-full max-w-sm space-y-2">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Type quickly…"
        aria-label="Search"
      />
      <p className="text-foreground-muted text-xs">
        live: <code>{q || '∅'}</code> · debounced (400 ms): <code>{debounced || '∅'}</code>
      </p>
    </div>
  );
}

function DelayedLoadingDemo() {
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const showSkeleton = useDelayedLoading(300);
  const run = (ms: number) => {
    setSlow(ms > 300);
    setLoading(true);
    window.setTimeout(() => setLoading(false), ms);
  };
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => run(150)} disabled={loading}>
          Fast load (150 ms)
        </Button>
        <Button size="sm" variant="outline" onClick={() => run(1500)} disabled={loading}>
          Slow load (1.5 s)
        </Button>
      </div>
      <div className="h-10">
        {loading ? (
          showSkeleton && slow ? (
            <Skeleton className="h-10 w-full" />
          ) : null
        ) : (
          <p className="text-sm">Content ready.</p>
        )}
      </div>
    </div>
  );
}

function FieldIdsDemo() {
  const [value, setValue] = useState('');
  const error = value.length > 0 && value.length < 3 ? 'At least 3 characters.' : undefined;
  const { fieldId, helperId, errorId, describedBy } = useFieldIds(undefined, {
    hasHelper: true,
    hasError: Boolean(error),
  });
  return (
    <div className="w-full max-w-sm space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium">
        Workspace slug
      </label>
      <input
        id={fieldId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className="border-border-input bg-card h-9 w-full rounded-md border px-3 text-sm"
      />
      {error ? (
        <p id={errorId} className="text-danger-text text-xs">
          {error}
        </p>
      ) : (
        <p id={helperId} className="text-foreground-muted text-xs">
          Lowercase letters and dashes.
        </p>
      )}
      <p className="text-foreground-subtle text-xs">
        aria-describedby = <code>{describedBy}</code>
      </p>
    </div>
  );
}

const doc: ComponentDoc = {
  slug: 'hooks',
  name: 'Hooks',
  group: 'Utilities',
  description:
    'Small, SSR-safe hooks the components use internally and export for your own UI: media queries, reduced motion, the platform modifier key, form field ids, debouncing, and delayed loading indicators.',
  exports: [
    'useMediaQuery',
    'usePrefersReducedMotion',
    'useModifierKey',
    'useFieldIds',
    'useDebounce',
    'useDebouncedCallback',
    'useDelayedLoading',
  ],
  sourceFile: '../../hooks',
  examples: [
    {
      title: 'useMediaQuery / usePrefersReducedMotion',
      description:
        'Subscribes to a CSS media query via useSyncExternalStore. The server snapshot is always `false`, so markup never mismatches; the client re-renders with the real value after hydration. Resize the window to see it flip.',
      preview: <MediaQueryDemo />,
      code: `const isDesktop = useMediaQuery('(min-width: 1024px)');
const reduced = usePrefersReducedMotion();

return reduced ? <StaticHero /> : <AnimatedHero />;`,
    },
    {
      title: 'useModifierKey',
      description:
        'Platform-correct shortcut hint: `⌘` on Apple devices, `Ctrl` elsewhere. Defaults to Ctrl until mounted so server output is deterministic.',
      preview: <ModifierDemo />,
      code: `const mod = useModifierKey();

<button aria-label={\`Search (\${mod.label}+K)\`}>
  <Kbd>{mod.symbol}</Kbd> <Kbd>K</Kbd>
</button>`,
    },
    {
      title: 'useDebounce',
      description:
        'Returns the value once it has stopped changing for `delay` ms (default 300). Drive fetches or URL state from the debounced value, not the live one. `useDebouncedCallback` is the callback-flavoured twin for autosave.',
      preview: <DebounceDemo />,
      code: `const [q, setQ] = useState('');
const debouncedQ = useDebounce(q, 400);
useEffect(() => { fetchRows(debouncedQ); }, [debouncedQ]);

// or
const save = useDebouncedCallback((draft: string) => api.save(draft), 500);`,
    },
    {
      title: 'useDelayedLoading',
      description:
        'Returns `false` until `ms` has elapsed, then `true`. Gate skeletons behind it so sub-300 ms loads never flash a placeholder — the fast button shows nothing, the slow one shows a skeleton.',
      preview: <DelayedLoadingDemo />,
      code: `const showSkeleton = useDelayedLoading(300);

if (isLoading) return showSkeleton ? <Skeleton className="h-10" /> : null;
return <Content />;`,
    },
    {
      title: 'useFieldIds',
      description:
        'Stable id for a control plus derived helper / error ids, and an `aria-describedby` that only references elements that actually render (error wins over helper). Pass a consumer `id` to keep `<label htmlFor>` in sync.',
      preview: <FieldIdsDemo />,
      code: `const { fieldId, helperId, errorId, describedBy } = useFieldIds(id, {
  hasHelper: Boolean(helperText),
  hasError: Boolean(error),
});

<label htmlFor={fieldId}>{label}</label>
<input id={fieldId} aria-describedby={describedBy} aria-invalid={!!error} />
{error ? <p id={errorId}>{error}</p> : <p id={helperId}>{helperText}</p>}`,
    },
  ],
  api: [
    {
      title: 'Signatures',
      rows: [
        { name: 'useMediaQuery', type: '(query: string) => boolean', description: '' },
        { name: 'usePrefersReducedMotion', type: '() => boolean', description: '' },
        {
          name: 'useModifierKey',
          type: "() => { symbol: '⌘' | 'Ctrl'; label: 'Cmd' | 'Ctrl' }",
          description: '',
        },
        {
          name: 'useFieldIds',
          type: '(id?: string, present?: { hasHelper?; hasError?; extra? }) => FieldIds',
          description: '`extra` appends consumer-supplied describedby ids.',
        },
        { name: 'useDebounce', type: '<T>(value: T, delay = 300) => T', description: '' },
        {
          name: 'useDebouncedCallback',
          type: '<A>(fn: (...a: A) => void, delay = 300) => (...a: A) => void',
          description:
            'Stable identity; always calls the latest `fn`; pending call dropped on unmount.',
        },
        { name: 'useDelayedLoading', type: '(ms: number) => boolean', description: '' },
      ],
    },
  ],
  related: [
    { slug: 'toast', reason: '`useToast` — the imperative toast queue.' },
    { slug: 'design-system-provider', reason: '`useStrings` — read the resolved UI strings.' },
    { slug: 'skeleton', reason: 'What `useDelayedLoading` gates.' },
  ],
};

export default doc;
