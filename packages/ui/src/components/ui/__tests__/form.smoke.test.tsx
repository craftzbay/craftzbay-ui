import { describe, expect, it } from 'vitest';
import { useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
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

  it('surfaces RHF error through FormError, aria-describedby and one form live region', async () => {
    const user = userEvent.setup();
    render(<Demo rules={{ required: 'Email is required' }} withDescription />);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const message = await screen.findByText('Email is required', { selector: 'p' });
    expect(message).not.toHaveAttribute('role');
    // Exactly one live region per form, announcing the current error set.
    const regions = screen.getAllByRole('status');
    expect(regions).toHaveLength(1);
    expect(regions[0]).toHaveTextContent('Email is required');
    expect(screen.queryByRole('alert')).toBeNull();

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedBy = input.getAttribute('aria-describedby')!.split(' ');
    expect(describedBy).toContain(message.id);
    expect(message.id.endsWith('-error')).toBe(true);
    describedBy.forEach((id) => expect(document.getElementById(id)).not.toBeNull());

    // Invalid styling is driven by aria-invalid on the input (no tone injection).
    expect(input.parentElement?.className).toContain('has-aria-invalid:border-danger');
  });

  it('derives the description synchronously (ids are -desc / -error)', () => {
    render(<Demo withDescription />);
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-describedby')).toMatch(/-desc$/);
  });

  it('is axe-clean with description and error', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Demo rules={{ required: 'Email is required' }} withDescription />,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await screen.findByText('Email is required', { selector: 'p' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
