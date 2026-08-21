import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormError } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

function Demo() {
  const form = useForm({ defaultValues: { email: '', password: '' } });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => alert(JSON.stringify(v)))}
        className="flex w-full max-w-sm flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@company.com" {...field} />
              </FormControl>
              <FormError />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormError />
            </FormItem>
          )}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  );
}

const doc: ComponentDoc = {
  slug: 'form',
  name: 'Form',
  group: 'Inputs',
  description:
    'react-hook-form bindings. Form / FormField / FormItem / FormLabel / FormControl / FormError compose with any input to give consistent labels, errors, and aria-describedby wiring.',
  exports: ['Form', 'FormField', 'FormItem', 'FormLabel', 'FormControl', 'FormError'],
  sourceFile: 'Form.tsx',
  examples: [
    {
      title: 'Sign-in form',
      description:
        'rules can be inline (as shown) or a Zod resolver — anything react-hook-form supports.',
      preview: <Demo />,
      code: `const form = useForm({ defaultValues: { email: '', password: '' } });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      rules={{ required: 'Email is required' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
          <FormError />
        </FormItem>
      )}
    />
    <Button type="submit">Sign in</Button>
  </form>
</Form>`,
    },
  ],
  api: [
    {
      title: 'Form (root)',
      rows: [
        {
          name: '…useFormReturn',
          type: 'UseFormReturn<TFieldValues>',
          description: 'Spread the result of useForm().',
        },
      ],
    },
    {
      title: 'FormField',
      rows: [
        {
          name: 'control',
          type: 'Control',
          required: true,
          description: 'form.control from useForm.',
        },
        { name: 'name', type: 'string', required: true, description: 'Field key.' },
        {
          name: 'rules',
          type: 'RegisterOptions',
          description: 'react-hook-form validation rules.',
        },
        {
          name: 'render',
          type: '({ field, fieldState }) => ReactNode',
          required: true,
          description: 'Render the input bound to field.',
        },
      ],
    },
  ],
  accessibility: [
    'FormLabel and FormError auto-link to the input via aria-describedby and aria-invalid.',
    'FormError renders the active error from react-hook-form automatically.',
  ],
  related: [{ slug: 'input', reason: 'Common form field.' }],
};

export default doc;
