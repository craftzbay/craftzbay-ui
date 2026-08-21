import { type SVGProps } from 'react';
import { cn } from '@/lib/utils';

/* Refined-minimal line illustrations. Single accent stroke, no fills.
 * Drop into EmptyState / ErrorState / FirstRunEmpty `icon` slots. */

type Props = SVGProps<SVGSVGElement>;

function Base({ className, children, ...props }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      width="120"
      height="120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('text-foreground-subtle', className)}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function InboxEmpty(props: Props) {
  return (
    <Base {...props}>
      <path d="M22 56l10-28a6 6 0 0 1 6-4h44a6 6 0 0 1 6 4l10 28" />
      <path d="M22 56v32a6 6 0 0 0 6 6h64a6 6 0 0 0 6-6V56" />
      <path d="M22 56h22l4 10h24l4-10h22" />
      <circle cx="60" cy="36" r="2" className="text-accent" stroke="currentColor" />
      <path d="M52 28l8 8M68 28l-8 8" opacity="0.4" />
    </Base>
  );
}

export function NoSearchResults(props: Props) {
  return (
    <Base {...props}>
      <circle cx="52" cy="52" r="26" />
      <path d="M72 72l20 20" />
      <path d="M42 52h20" opacity="0.5" />
      <circle cx="98" cy="22" r="1.5" className="text-accent" stroke="currentColor" />
      <circle cx="20" cy="92" r="1.5" className="text-accent" stroke="currentColor" />
    </Base>
  );
}

export function NotFound(props: Props) {
  return (
    <Base {...props}>
      <path d="M22 32h76v56a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V32z" />
      <path d="M22 44h76" />
      <circle cx="32" cy="38" r="1.5" />
      <circle cx="40" cy="38" r="1.5" />
      <circle cx="48" cy="38" r="1.5" />
      <path d="M44 64l32 16M76 64l-32 16" className="text-accent" stroke="currentColor" />
      <text
        x="60"
        y="76"
        fontFamily="ui-monospace,monospace"
        fontSize="9"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        opacity="0.6"
      >
        404
      </text>
    </Base>
  );
}

export function ServerError(props: Props) {
  return (
    <Base {...props}>
      <rect x="22" y="28" width="76" height="20" rx="3" />
      <rect x="22" y="54" width="76" height="20" rx="3" />
      <rect x="22" y="80" width="76" height="20" rx="3" />
      <circle cx="32" cy="38" r="2" className="text-danger" stroke="currentColor" />
      <circle cx="32" cy="64" r="2" className="text-danger" stroke="currentColor" />
      <circle cx="32" cy="90" r="2" className="text-warning" stroke="currentColor" />
      <path d="M44 38h44M44 64h44M44 90h28" opacity="0.4" />
      <path d="M82 84l16 16M82 100l16-16" className="text-danger" stroke="currentColor" />
    </Base>
  );
}

export function Construction(props: Props) {
  return (
    <Base {...props}>
      <path d="M22 86h76" />
      <path d="M30 86V52l30-22 30 22v34" />
      <rect x="40" y="64" width="14" height="14" rx="1" />
      <rect x="66" y="64" width="14" height="14" rx="1" />
      <path d="M30 52h60" opacity="0.4" />
      <path d="M40 40v6M50 36v10M70 36v10M80 40v6" className="text-accent" stroke="currentColor" />
    </Base>
  );
}

export function ConnectionLost(props: Props) {
  return (
    <Base {...props}>
      <path d="M22 60a40 40 0 0 1 76 0" opacity="0.4" />
      <path d="M34 70a28 28 0 0 1 52 0" opacity="0.6" />
      <path d="M46 80a16 16 0 0 1 28 0" />
      <circle cx="60" cy="92" r="3" />
      <path d="M20 20l80 80" className="text-danger" stroke="currentColor" />
    </Base>
  );
}

export function Locked(props: Props) {
  return (
    <Base {...props}>
      <rect x="34" y="54" width="52" height="40" rx="4" />
      <path d="M44 54v-10a16 16 0 0 1 32 0v10" />
      <circle cx="60" cy="72" r="4" />
      <path d="M60 76v8" />
    </Base>
  );
}
