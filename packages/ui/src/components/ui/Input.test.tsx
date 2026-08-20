import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Input } from './Input';

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

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <Input label="Email" />
        <Input label="Password" type="password" />
        <Input label="Search" error="No matches" />
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
    await user.click(toggle);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  });

  it('clearable works uncontrolled', async () => {
    const user = userEvent.setup();
    render(<Input label="Search" type="search" clearable />);
    const input = screen.getByLabelText('Search');
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull();
    await user.type(input, 'hello');
    await user.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(input).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear input' })).toBeNull();
  });

  it('accepts any HTML input type', () => {
    render(<Input label="When" type="datetime-local" />);
    expect(screen.getByLabelText('When')).toHaveAttribute('type', 'datetime-local');
  });

  it('only references rendered ids in aria-describedby', () => {
    const { rerender } = render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby');
    rerender(<Input label="Email" helperText="Work email" />);
    const input = screen.getByLabelText('Email');
    const id = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(id)).toHaveTextContent('Work email');
  });
});
