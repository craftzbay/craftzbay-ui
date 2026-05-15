import {
  createContext,
  forwardRef,
  useContext,
  useId,
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
    ...fieldState,
  };
}

export const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function FormItem({ className, ...props }, ref) {
    const id = useId();
    return (
      <FormItemContext.Provider value={{ id }}>
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
      className={cn(
        'text-sm font-medium text-foreground',
        error && 'text-danger-text',
        className,
      )}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

export const FormControl = forwardRef<HTMLElement, React.ComponentPropsWithoutRef<typeof Slot>>(
  function FormControl(props, ref) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = 'FormControl';

export const FormDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function FormDescription({ className, ...props }, ref) {
    const { formDescriptionId } = useFormField();
    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn('text-xs text-foreground-subtle', className)}
        {...props}
      />
    );
  },
);
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
        className={cn('text-xs text-danger-text', className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormError.displayName = 'FormError';
