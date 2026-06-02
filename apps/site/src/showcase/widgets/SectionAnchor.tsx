import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionAnchorProps {
  id: string;
  level?: 2 | 3;
  children: ReactNode;
  className?: string;
}

/**
 * Heading with a self-link. Clicking scrolls without polluting the hash —
 * the route hash already encodes the page; in-page sections use IDs only.
 */
export function SectionAnchor({ id, level = 2, children, className }: SectionAnchorProps) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <Tag
      id={id}
      className={cn(
        'group scroll-mt-24',
        level === 2
          ? 'mb-3 mt-12 text-xl font-semibold tracking-tight'
          : 'mb-2 mt-8 text-base font-semibold',
        className,
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="inline-flex items-center gap-2 text-inherit hover:no-underline"
      >
        {children}
        <span
          aria-hidden
          className="text-foreground-subtle opacity-0 transition-opacity group-hover:opacity-100"
        >
          #
        </span>
      </button>
    </Tag>
  );
}
