import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from '@/lib/cva';

const card = cva(
  [
    'rounded-lg border bg-card text-card-foreground',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
  ],
  {
    variants: {
      variant: {
        default: 'border-border',
        interactive:
          'border-border hover:border-border-strong hover:bg-background-subtle cursor-pointer',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  },
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof card> {}

/**
 * Bounded surface used to group related content. Per the refined-minimal
 * rules, cards on the page have a hairline border and no shadow.
 *
 * @example Header + content + footer
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Storage</CardTitle>
 *       <CardDescription>Usage across all projects.</CardDescription>
 *     </CardHeader>
 *     <CardContent>…</CardContent>
 *     <CardFooter><Button>Upgrade</Button></CardFooter>
 *   </Card>
 *
 * @example Clickable list row
 *   <Card variant="interactive" onClick={open}>…</Card>
 *
 * @do Use the `border` style. If a card needs to "float" (modal, dropdown),
 *      it isn't a Card — it's a Popover/Dialog.
 * @dont Add `shadow-lg` to Cards. Shadows on inline surfaces violate the
 *       refined-minimal direction.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, padding, ...props },
  ref,
) {
  return <div ref={ref} className={cn(card({ variant, padding }), className)} {...props} />;
});
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1 pb-4', className)}
        {...props}
      />
    );
  },
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn('text-base font-semibold text-foreground leading-tight', className)}
        {...props}
      />
    );
  },
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-foreground-muted', className)}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('text-sm text-foreground', className)} {...props} />;
  },
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 pt-4', className)}
        {...props}
      />
    );
  },
);
CardFooter.displayName = 'CardFooter';
