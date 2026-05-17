import { useState, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  preview: ReactNode;
  code: string;
  language?: string;
  /** Tweak the preview surface — e.g. add min-height for overlays. */
  surfaceClassName?: string;
}

/**
 * shadcn-style "Preview / Code" tab widget. Tabs hold their own state per
 * instance so a page can flip individual examples without affecting others.
 */
export function CodePreview({
  preview,
  code,
  language = 'tsx',
  surfaceClassName,
}: CodePreviewProps) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center border-b border-border bg-background-subtle/60 px-2">
        <Tab active={tab === 'preview'} onClick={() => setTab('preview')}>
          Preview
        </Tab>
        <Tab active={tab === 'code'} onClick={() => setTab('code')}>
          Code
        </Tab>
      </div>

      {tab === 'preview' ? (
        <div
          className={cn(
            'flex min-h-[180px] items-center justify-center p-8',
            surfaceClassName,
          )}
        >
          {preview}
        </div>
      ) : (
        <CodeBlock code={code} language={language} className="rounded-none border-0" />
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'relative px-3 py-2 text-xs font-medium outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
        active
          ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-accent'
          : 'text-foreground-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
