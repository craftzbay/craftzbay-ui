'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from '@/icons';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  Compound API:
 *
 *    <Select value={…} onValueChange={…}>
 *      <SelectTrigger placeholder="Pick one" />
 *      <SelectContent>
 *        <SelectGroup label="Active">
 *          <SelectItem value="a">Apple</SelectItem>
 *          <SelectItem value="b">Banana</SelectItem>
 *        </SelectGroup>
 *      </SelectContent>
 *    </Select>
 *
 *  All accessibility is handled by Radix: keyboard navigation, type-ahead,
 *  focus trap, ARIA roles. We only style.
 * --------------------------------------------------------------------------- */

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps
  extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'children'> {
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Trigger height — matches Input sizes. */
  size?: 'sm' | 'md' | 'lg';
  /** Visual tone — `error` swaps the border + ring to danger. */
  tone?: 'default' | 'error';
}

export const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(function SelectTrigger({ className, placeholder, size = 'md', tone = 'default', ...props }, ref) {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex w-full items-center justify-between gap-2 rounded-md border bg-card text-lg md:text-sm text-foreground',
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
        'outline-none',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'data-[placeholder]:text-foreground-subtle',
        size === 'sm' && 'h-8 px-2.5',
        size === 'md' && 'h-9 px-3',
        size === 'lg' && 'h-10 px-3.5',
        tone === 'default'
          ? 'border-border-input focus-visible:border-accent focus-visible:ring-ring'
          : 'border-danger focus-visible:border-danger focus-visible:ring-danger',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Value placeholder={placeholder} />
      <SelectPrimitive.Icon asChild>
        <ChevronsUpDown className="size-4 text-foreground-subtle shrink-0" aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const scrollBtn =
  'flex h-6 cursor-default items-center justify-center text-foreground-subtle';

export const SelectScrollUpButton = forwardRef<
  ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(function SelectScrollUpButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollUpButton ref={ref} className={cn(scrollBtn, className)} {...props}>
      <ChevronUp className="size-4" aria-hidden />
    </SelectPrimitive.ScrollUpButton>
  );
});
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

export const SelectScrollDownButton = forwardRef<
  ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(function SelectScrollDownButton({ className, ...props }, ref) {
  return (
    <SelectPrimitive.ScrollDownButton ref={ref} className={cn(scrollBtn, className)} {...props}>
      <ChevronDown className="size-4" aria-hidden />
    </SelectPrimitive.ScrollDownButton>
  );
});
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(function SelectContent({ className, children, position = 'popper', ...props }, ref) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          'z-[var(--z-popover)] min-w-[var(--radix-select-trigger-width)] max-h-96',
          'overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground',
          'shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = 'SelectContent';

export const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(function SelectLabel({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn('px-2 py-1.5 text-xs font-medium text-foreground-subtle', className)}
      {...props}
    />
  );
});
SelectLabel.displayName = 'SelectLabel';

export interface SelectItemProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /** Icon shown to the left of the label. */
  leadingIcon?: ReactNode;
}

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(function SelectItem({ className, children, leadingIcon, ...props }, ref) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center gap-2',
        'rounded-sm px-2 py-1.5 pr-8 text-sm text-foreground outline-none',
        'data-[highlighted]:bg-background-muted data-[highlighted]:text-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      {leadingIcon && (
        <span className="flex items-center text-foreground-subtle [&_svg]:size-4">
          {leadingIcon}
        </span>
      )}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4 text-accent" aria-hidden />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = 'SelectItem';

export const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
});
SelectSeparator.displayName = 'SelectSeparator';

/** Optional grouping with a label header. Pure composition over Radix Group + Label. */
export interface SelectGroupProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Group> {
  label?: ReactNode;
}
export const SelectGroup = forwardRef<
  ElementRef<typeof SelectPrimitive.Group>,
  SelectGroupProps
>(function SelectGroup({ label, children, ...props }, ref) {
  return (
    <SelectPrimitive.Group ref={ref} {...props}>
      {label && <SelectLabel>{label}</SelectLabel>}
      {children}
    </SelectPrimitive.Group>
  );
});
SelectGroup.displayName = 'SelectGroup';

/**
 * Compose `Select` + `SelectTrigger` + `SelectContent` + `SelectItem` for a
 * single-choice picker. Keyboard, type-ahead, and ARIA come from Radix.
 *
 * @example Basic
 *   <Select onValueChange={setStatus}>
 *     <SelectTrigger placeholder="Status" />
 *     <SelectContent>
 *       <SelectItem value="open">Open</SelectItem>
 *       <SelectItem value="closed">Closed</SelectItem>
 *     </SelectContent>
 *   </Select>
 *
 * @example Grouped
 *   <SelectContent>
 *     <SelectGroup label="People">
 *       <SelectItem value="anu">Anu</SelectItem>
 *       <SelectItem value="bat">Bat</SelectItem>
 *     </SelectGroup>
 *     <SelectSeparator />
 *     <SelectGroup label="Bots">
 *       <SelectItem value="robo">Robo</SelectItem>
 *     </SelectGroup>
 *   </SelectContent>
 *
 * @do Use `placeholder` on the trigger when there is no default value.
 * @dont Use Select for more than ~12 options — switch to `Combobox`.
 */
