import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { TagInput } from './TagInput';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('TagInput', () => {
  it('associates the label, shows the default placeholder and helper text', () => {
    render(<TagInput label="Tags" description="Comma separated" />);
    const input = screen.getByLabelText('Tags');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('placeholder', 'Add and press Enter');
    expect(input).toHaveAccessibleDescription('Comma separated');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('uncontrolled: Enter / comma add, duplicates and blanks are ignored, Backspace removes last', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput label="Tags" defaultValue={['a']} onChange={onChange} />);
    const input = screen.getByLabelText('Tags');
    await user.type(input, 'b{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
    await user.type(input, 'c,');
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);
    expect(input).toHaveValue('');
    onChange.mockClear();
    await user.type(input, 'a{Enter}');
    await user.type(input, '   {Enter}');
    expect(onChange).not.toHaveBeenCalled();
    await user.clear(input);
    await user.keyboard('{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
    expect(screen.queryByRole('button', { name: 'Remove c' })).toBeNull();
  });

  it('placeholder disappears once there are tags', () => {
    render(<TagInput label="Tags" defaultValue={['x']} />);
    expect(screen.getByLabelText('Tags')).not.toHaveAttribute('placeholder');
  });

  it('controlled: value/onChange; chip remove button removes by index', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [v, setV] = useState(['one', 'two']);
      return (
        <>
          <TagInput label="Tags" value={v} onChange={setV} />
          <output data-testid="out">{v.join('|')}</output>
        </>
      );
    }
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Remove one' }));
    expect(screen.getByTestId('out')).toHaveTextContent('two');
    await user.type(screen.getByLabelText('Tags'), 'three{Enter}');
    expect(screen.getByTestId('out')).toHaveTextContent('two|three');
  });

  it('commits the draft on blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput label="Tags" onChange={onChange} />);
    await user.type(screen.getByLabelText('Tags'), 'draft');
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(['draft']);
  });

  it('max caps the list; custom separators', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TagInput label="Tags" defaultValue={['a']} max={2} separators={[' ']} onChange={onChange} />,
    );
    const input = screen.getByLabelText('Tags');
    await user.type(input, 'b ');
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
    onChange.mockClear();
    await user.type(input, 'c ');
    expect(onChange).not.toHaveBeenCalled();
    await user.type(input, 'd{Enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('error: boolean paints only; node renders message and wires aria', () => {
    const { rerender, container } = render(<TagInput label="Tags" description="Hint" error />);
    const input = screen.getByLabelText('Tags');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Hint');
    expect(container.querySelector('.border-danger')).not.toBeNull();
    rerender(<TagInput label="Tags" description="Hint" error="Required" />);
    expect(screen.getByLabelText('Tags')).toHaveAccessibleDescription('Required');
    expect(screen.queryByText('Hint')).toBeNull();
  });

  it('disabled disables the input and dims the field', () => {
    const { container } = render(<TagInput label="Tags" disabled />);
    expect(screen.getByLabelText('Tags')).toBeDisabled();
    expect(container.querySelector('.opacity-50')).not.toBeNull();
  });

  it('hideLabel + aria-label fallback', () => {
    const { rerender } = render(<TagInput label="Tags" hideLabel />);
    expect(screen.getByText('Tags')).toHaveClass('sr-only');
    rerender(<TagInput aria-label="Keywords" />);
    expect(screen.getByRole('textbox', { name: 'Keywords' })).toBeInTheDocument();
  });

  it('unlabelled input is named after the placeholder; id defers to an external label', async () => {
    const { container, unmount } = render(<TagInput placeholder="Add a tag" />);
    expect(screen.getByRole('textbox', { name: 'Add a tag' })).toHaveAttribute(
      'aria-label',
      'Add a tag',
    );
    expect(await axe(container)).toHaveNoViolations();
    unmount();

    const second = render(<TagInput />);
    expect(screen.getByRole('textbox', { name: 'Add and press Enter' })).toBeInTheDocument();
    second.unmount();

    render(
      <>
        <label htmlFor="ext">External</label>
        <TagInput id="ext" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'External' })).not.toHaveAttribute('aria-label');
  });

  it('uses Mongolian strings from the provider', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <TagInput label="Tags" defaultValue={['go']} />
        <TagInput label="Empty" />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: 'go-г устгах' })).toBeInTheDocument();
    expect(screen.getByLabelText('Empty')).toHaveAttribute('placeholder', 'Бичээд Enter дарна уу');
  });

  it('forwards ref to the wrapper, merges className, honours id', () => {
    const ref = createRef<HTMLDivElement>();
    render(<TagInput ref={ref} label="Tags" className="w-80" id="tags-id" />);
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current).toHaveClass('w-80', 'flex-col');
    expect(screen.getByLabelText('Tags')).toHaveAttribute('id', 'tags-id');
  });

  it('is axe-clean with tags and in error state', async () => {
    const { container } = render(
      <div>
        <TagInput label="Tags" defaultValue={['a', 'b']} description="Hint" />
        <TagInput label="Bad" error="Required" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
