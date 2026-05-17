import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { Form, FormControl, FormDescription, FormError, FormField, FormItem, FormLabel } from './Form';
import { Input } from './Input';

const meta: Meta = { title: 'Primitives/Form' };
export default meta;
type Story = StoryObj;

interface FormValues { email: string; }

function Demo() {
  const form = useForm<FormValues>({ defaultValues: { email: '' } });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="flex w-72 flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@company.com" {...field} /></FormControl>
              <FormDescription>We will never share your email.</FormDescription>
              <FormError />
            </FormItem>
          )}
        />
        <Button type="submit">Continue</Button>
      </form>
    </Form>
  );
}

export const Default: Story = { render: () => <Demo /> };
