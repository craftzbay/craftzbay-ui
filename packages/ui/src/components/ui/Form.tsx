'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useState,
  type HTMLAttributes,
} from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  react-hook-form bindings + accessible label / description / error wiring.
 *
 *  Usage:
 *    const form = useForm<Values>(…);
 *    <Form {...form}>
 *      <FormField
 *        control={form.control}
 *        name="email"
 *        render={({ field }) => (
 *          <FormItem>
 *            <FormLabel>Email</FormLabel>
 *            <FormControl><Input type="email" {...field} /></FormControl>
 *            <FormDescription>We never share this.</FormDescription>
 *            <FormError />
 *          </FormItem>
 *        )}
 *      />
 *    </Form>
 * --------------------------------------------------------------------------- */

export const Form = FormProvider;

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name as string }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

interface FormItemContextValue {
  id: string;
  /** Whether a <FormDescription> is mounted — drives aria-describedby. */
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
}
const FormItemContext = createContext<FormItemContextValue | null>(null);

export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  if (!fieldContext) {
    throw new Error('useFormField must be used inside <FormField>');
  }
  const fieldState = getFieldState(fieldContext.name, formState);
  const id = itemContext?.id ?? '';
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-item`,
    formDescriptionId: `${id}-desc`,
    formMessageId: `${id}-error`,
    hasDescription: itemContext?.hasDescription ?? false,
    ...fieldState,
  };
}

export const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function FormItem({ className, ...props }, ref) {
    const id = useId();
    const [hasDescription, setHasDescription] = useState(false);
    return (
      <FormItemContext.Provider value={{ id, hasDescription, setHasDescription }}>
        <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

export const FormLabel = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function FormLabel({ className, ...props }, ref) {
  const { formItemId, error } = useFormField();
  return (
    <LabelPrimitive.Root
      ref={ref}
      htmlFor={formItemId}
      className={cn('text-foreground text-sm font-medium', error && 'text-danger-text', className)}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

export const FormControl = forwardRef<HTMLElement, React.ComponentPropsWithoutRef<typeof Slot>>(
  function FormControl(props, ref) {
    const { error, formItemId, formDescriptionId, formMessageId, hasDescription } = useFormField();
    // Only reference ids that actually render: the description when mounted,
    // the message only while there is an error (FormError returns null otherwise).
    const describedBy =
      [hasDescription ? formDescriptionId : null, error ? formMessageId : null]
        .filter(Boolean)
        .join(' ') || undefined;
    // Input-style children read `tone="error"` for the red border; plain
    // elements ignore the unknown prop via Slot merging only when they accept it,
    // so it is only set while there is an error.
    const toneProps = error ? { tone: 'error' as const } : {};
    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        {...toneProps}
        {...props}
      />
    );
  },
);
FormControl.displayName = 'FormControl';

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function FormDescription({ className, ...props }, ref) {
  const { formDescriptionId } = useFormField();
  const itemContext = useContext(FormItemContext);
  const setHasDescription = itemContext?.setHasDescription;
  useEffect(() => {
    setHasDescription?.(true);
    return () => setHasDescription?.(false);
  }, [setHasDescription]);
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-foreground-subtle text-xs', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

export const FormError = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function FormError({ className, children, ...props }, ref) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? '') : children;
    if (!body) return null;
    return (
      <p
        ref={ref}
        id={formMessageId}
        role="alert"
        className={cn('text-danger-text text-xs', className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormError.displayName = 'FormError';
