import { describe, expect, it } from 'vitest';
import { useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormItem,
  FormLabel,
} from '../Form';
import { Input } from '../Input';

function Demo({
  rules,
  withDescription,
}: { rules?: Record<string, unknown>; withDescription?: boolean } = {}) {
  const form = useForm({ defaultValues: { email: '' } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="email"
          rules={rules}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              {withDescription && <FormDescription>We never share this.</FormDescription>}
              <FormError />
            </FormItem>
          )}
        />
        <button type="submit">Save</button>
      </form>
    </Form>
  );
}

describe('Form (smoke)', () => {
  it('renders label + control and no dangling aria-describedby', () => {
    render(<Demo />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('references the description when present', () => {
    render(<Demo withDescription />);
    const input = screen.getByLabelText('Email');
    const id = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(id)).toHaveTextContent('We never share this.');
  });

  it('surfaces RHF error through FormError with the error tone on Input', async () => {
    const user = userEvent.setup();
    render(<Demo rules={{ required: 'Email is required' }} withDescription />);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const message = await screen.findByRole('alert');
    expect(message).toHaveTextContent('Email is required');

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedBy = input.getAttribute('aria-describedby')!.split(' ');
    expect(describedBy).toContain(message.id);
    describedBy.forEach((id) => expect(document.getElementById(id)).not.toBeNull());

    // The field shell (the input's parent) should carry the danger border.
    expect(input.parentElement?.className).toContain('border-danger');
  });
});
