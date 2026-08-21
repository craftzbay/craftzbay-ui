import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('associates the label and renders helper text via aria-describedby', () => {
    render(<Textarea label="Note" helperText="Optional" />);
    const ta = screen.getByLabelText('Note');
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta).toHaveAttribute('rows', '3');
    expect(ta).toHaveAccessibleDescription('Optional');
    expect(ta).not.toHaveAttribute('aria-invalid');
    expect(ta).toHaveClass('min-h-20', 'resize-y');
  });

  it('error replaces helper text and sets aria-invalid', () => {
    render(<Textarea label="Note" helperText="Optional" error="Required" />);
    const ta = screen.getByLabelText('Note');
    expect(ta).toHaveAttribute('aria-invalid', 'true');
    expect(ta).toHaveAccessibleDescription('Required');
    expect(screen.queryByText('Optional')).toBeNull();
  });

  it('respects a consumer aria-invalid without an error message', () => {
    render(<Textarea label="Note" aria-invalid />);
    expect(screen.getByLabelText('Note')).toHaveAttribute('aria-invalid', 'true');
  });

  it('hideLabel keeps the label accessible', () => {
    render(<Textarea label="Note" hideLabel />);
    expect(screen.getByLabelText('Note')).toBeInTheDocument();
    expect(screen.getByText('Note')).toHaveClass('sr-only');
  });

  it('works uncontrolled (defaultValue) and controlled (value/onChange)', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Textarea label="A" defaultValue="hi" />);
    const a = screen.getByLabelText('A') as HTMLTextAreaElement;
    await user.type(a, '!');
    expect(a.value).toBe('hi!');
    unmount();

    const onChange = vi.fn();
    function Demo() {
      const [v, setV] = useState('');
      return (
        <Textarea
          label="B"
          value={v}
          onChange={(e) => {
            onChange(e.target.value);
            setV(e.target.value);
          }}
        />
      );
    }
    render(<Demo />);
    const b = screen.getByLabelText('B') as HTMLTextAreaElement;
    await user.type(b, 'ab');
    expect(onChange).toHaveBeenLastCalledWith('ab');
    expect(b.value).toBe('ab');
  });

  it('autoResize uses minRows, resize-none, and sets an explicit height', () => {
    render(<Textarea label="N" autoResize minRows={2} />);
    const ta = screen.getByLabelText('N') as HTMLTextAreaElement;
    expect(ta).toHaveAttribute('rows', '2');
    expect(ta).toHaveClass('resize-none');
    expect(ta.style.height).toMatch(/px$/);
  });

  it('disabled state is reflected', () => {
    render(<Textarea label="N" disabled />);
    expect(screen.getByLabelText('N')).toBeDisabled();
  });

  it('forwards ref to the textarea (object + callback) and spreads props', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const cb = vi.fn();
    const { rerender } = render(<Textarea ref={ref} label="N" data-testid="ta" name="note" />);
    expect(ref.current?.tagName).toBe('TEXTAREA');
    expect(ref.current).toHaveAttribute('data-testid', 'ta');
    expect(ref.current).toHaveAttribute('name', 'note');
    rerender(<Textarea ref={cb} label="N" />);
    expect(cb).toHaveBeenCalledWith(expect.any(HTMLTextAreaElement));
  });

  it('className applies to the wrapper', () => {
    const { container } = render(<Textarea label="N" className="w-80" />);
    expect(container.firstElementChild).toHaveClass('w-80', 'flex-col');
  });

  it('is axe-clean in default and error states', async () => {
    const { container } = render(
      <div>
        <Textarea label="Note" helperText="Optional" />
        <Textarea label="Bio" error="Required" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
