import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
} from './Form';
import { Input } from './Input';
import { Checkbox } from './Checkbox';

type Values = { email: string; agree: boolean };

function Demo({
  onSubmit = () => {},
  withDescription = true,
  itemRef,
}: {
  onSubmit?: (v: Values) => void;
  withDescription?: boolean;
  itemRef?: React.Ref<HTMLDivElement>;
}) {
  const form = useForm<Values>({ defaultValues: { email: '', agree: false } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <FormItem ref={itemRef} className="item-x">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              {withDescription && <FormDescription>We never share this.</FormDescription>}
              <FormError />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agree"
          rules={{ validate: (v) => v || 'You must agree' }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  label="Agree"
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </FormControl>
              <FormError />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe('Form', () => {
  it('wires label → control id and description via aria-describedby', () => {
    render(<Demo />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', expect.stringMatching(/-item$/));
    const desc = input.getAttribute('aria-describedby')!;
    expect(desc).toMatch(/-desc$/);
    expect(document.getElementById(desc)).toHaveTextContent('We never share this.');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText('Email is required')).toBeNull();
  });

  it('omits aria-describedby when there is no description and no error', () => {
    render(<Demo withDescription={false} />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby');
  });

  it('on failed submit: aria-invalid, error id appended, label coloured, live region announces', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Demo onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    const input = await screen.findByLabelText('Email');
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    const ids = input.getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0])).toHaveTextContent('We never share this.');
    expect(document.getElementById(ids[1])).toHaveTextContent('Email is required');
    expect(screen.getByText('Email')).toHaveClass('text-danger-text');
    expect(onSubmit).not.toHaveBeenCalled();
    // single polite region with all messages
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Email is required');
    expect(status).toHaveTextContent('You must agree');
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('checkbox control also receives invalid wiring', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    const box = await screen.findByRole('checkbox');
    await waitFor(() => expect(box).toHaveAttribute('aria-invalid', 'true'));
    const ids = box.getAttribute('aria-describedby')!.split(' ');
    expect(document.getElementById(ids[ids.length - 1])).toHaveTextContent('You must agree');
  });

  it('valid submit passes values through', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Demo onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Email'), 'a@b.co');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({ email: 'a@b.co', agree: true });
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
  });

  it('FormError renders children when there is no field error', () => {
    function Demo2() {
      const form = useForm<{ x: string }>({ defaultValues: { x: '' } });
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="x"
            render={() => (
              <FormItem>
                <FormError>Static note</FormError>
              </FormItem>
            )}
          />
        </Form>
      );
    }
    render(<Demo2 />);
    expect(screen.getByText('Static note')).toBeInTheDocument();
  });

  it('FormItem forwards ref and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Demo itemRef={ref} />);
    expect(ref.current).toHaveClass('item-x', 'flex-col');
    expect(ref.current).toContainElement(screen.getByLabelText('Email'));
  });

  it('useFormField throws outside <FormField>', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bad() {
      const form = useForm();
      return (
        <Form {...form}>
          <Probe />
        </Form>
      );
    }
    function Probe() {
      useFormField();
      return null;
    }
    expect(() => render(<Bad />)).toThrow(/inside <FormField>/);
    error.mockRestore();
  });

  it('is axe-clean before and after validation', async () => {
    const user = userEvent.setup();
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await screen.findByText('Email is required');
    expect(await axe(container)).toHaveNoViolations();
  });
});
