import { useState } from 'react';
import { Check, Copy } from '@/icons';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  /** Display language label (tsx, css, bash, …) shown in the top-right. */
  language?: string;
  className?: string;
}

/**
 * Minimal pre/code block with a copy-to-clipboard button.
 * No syntax highlighting — keeps the showcase bundle small.
 */
export function CodeBlock({ code, language = 'tsx', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore — older browsers / non-secure contexts
    }
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-md border border-border bg-card font-mono text-[12.5px] leading-relaxed',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-background-subtle/60 px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
          {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="inline-flex items-center gap-1 rounded-sm px-1.5 py-1 text-[11px] text-foreground-muted outline-none transition-colors hover:bg-background-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}
