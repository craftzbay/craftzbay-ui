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
