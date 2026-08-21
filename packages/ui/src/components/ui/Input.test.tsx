import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Input } from './Input';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('Input', () => {
  it('accepts user input', async () => {
    render(<Input label="Email" hideLabel placeholder="email" />);
    const input = screen.getByPlaceholderText('email');
    await userEvent.type(input, 'jane@example.com');
    expect(input).toHaveValue('jane@example.com');
  });

  it('renders the label when not hidden', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('marks the field invalid when error is set', () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('applies size and tone classes to the field shell', () => {
    const { rerender } = render(<Input label="A" />);
    const shell = () => screen.getByLabelText('A').parentElement!;
    expect(shell()).toHaveClass('h-9');
    rerender(<Input label="A" size="lg" />);
    expect(shell()).toHaveClass('h-10');
    rerender(<Input label="A" error="x" />);
    expect(shell()).toHaveClass('border-danger');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Input label="Email" />
        <Input label="Password" type="password" />
        <Input label="Search" error="No matches" />
        <Input label="Disabled" disabled helperText="Off" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Input (interactions)', () => {
  it('password toggle is keyboard reachable and flips the type', async () => {
    const user = userEvent.setup();
    render(<Input label="Password" type="password" />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).not.toHaveAttribute('tabindex', '-1');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('clearable works uncontrolled and refocuses the input', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<Input label="Search" type="search" clearable onClear={onClear} />);
    const input = screen.getByLabelText('Search');
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull();
    await user.type(input, 'hello');
    await user.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onClear).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull();
  });

  it('clearable controlled: calls onClear and the parent resets the value', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [v, setV] = useState('abc');
      return (
        <Input
          label="Q"
          value={v}
          onChange={(e) => setV(e.target.value)}
          clearable
          onClear={() => setV('')}
        />
      );
    }
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(screen.getByLabelText('Q')).toHaveValue('');
  });

  it('clear button respects defaultValue for the initial visibility', () => {
    render(<Input label="Q" defaultValue="seed" clearable />);
    expect(screen.getByRole('button', { name: 'Clear input' })).toBeInTheDocument();
  });

  it('value={null} is a controlled empty value without a React warning', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onChange = vi.fn();
    render(<Input label="Q" value={null} onChange={onChange} clearable />);
    const input = screen.getByLabelText('Q');
    expect(input).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull();
    await userEvent.type(input, 'a');
    expect(onChange).toHaveBeenCalled();
    // still controlled → value stays empty
    expect(input).toHaveValue('');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('controlled: value prop drives the DOM and onChange carries the typed value', async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    render(<Input label="Q" value="fixed" onChange={(e) => seen.push(e.target.value)} />);
    const input = screen.getByLabelText('Q');
    await user.type(input, 'x');
    expect(seen).toEqual(['fixedx']);
    expect(input).toHaveValue('fixed');
  });

  it('accepts any HTML input type', () => {
    render(<Input label="When" type="datetime-local" />);
    expect(screen.getByLabelText('When')).toHaveAttribute('type', 'datetime-local');
  });

  it('search type gets a default prefix icon; prefix / suffix render', () => {
    const { container, rerender } = render(<Input label="S" type="search" />);
    expect(container.querySelector('svg')).not.toBeNull();
    rerender(<Input label="S" prefix={<span>$</span>} suffix={<span>USD</span>} />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('only references rendered ids in aria-describedby', () => {
    const { rerender } = render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby');
    rerender(<Input label="Email" helperText="Work email" />);
    let input = screen.getByLabelText('Email');
    let id = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(id)).toHaveTextContent('Work email');
    // error replaces helper, consumer id appended
    rerender(<Input label="Email" helperText="Work email" error="Bad" aria-describedby="ext" />);
    input = screen.getByLabelText('Email');
    const ids = input.getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0])).toHaveTextContent('Bad');
    expect(ids[1]).toBe('ext');
    expect(screen.queryByText('Work email')).toBeNull();
    id = ids[0];
  });

  it('aria-invalid passthrough styles the field as error', () => {
    render(<Input label="A" aria-invalid="true" />);
    const input = screen.getByLabelText('A');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.parentElement).toHaveClass('border-danger');
  });

  it('hideLabel keeps the label for AT and the helper text visible', () => {
    render(<Input label="Secret" hideLabel helperText="Hint" />);
    expect(screen.getByLabelText('Secret')).toBeInTheDocument();
    expect(screen.getByText('Secret')).toHaveClass('sr-only');
    expect(screen.getByText('Hint')).toBeInTheDocument();
  });

  it('disabled input: field dimmed, inner buttons unfocusable', () => {
    render(<Input label="P" type="password" disabled defaultValue="x" clearable />);
    expect(screen.getByLabelText('P')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'Clear input' })).toHaveAttribute('tabindex', '-1');
  });

  it('consumer id is used; ref reaches the native input; className on wrapper; props spread', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <Input ref={ref} id="email" label="E" className="extra" name="email" autoComplete="email" />,
    );
    expect(ref.current).toBe(screen.getByLabelText('E'));
    expect(ref.current).toHaveAttribute('id', 'email');
    expect(ref.current).toHaveAttribute('name', 'email');
    expect(ref.current).toHaveAttribute('autocomplete', 'email');
    expect(container.firstElementChild).toHaveClass('extra');
  });

  it('function refs also receive the input', () => {
    const fnRef = vi.fn();
    render(<Input ref={fnRef} label="E" />);
    expect(fnRef).toHaveBeenCalledWith(screen.getByLabelText('E'));
  });

  it('localises inner button labels', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Input label="P" type="password" defaultValue="x" clearable />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: mnStrings.input.showPassword })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: mnStrings.input.clear })).toBeInTheDocument();
  });
});
