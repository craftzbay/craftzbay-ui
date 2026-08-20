import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Textarea } from '../Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../Select';
import { Combobox } from '../Combobox';
import { MultiSelect } from '../MultiSelect';
import { Checkbox } from '../Checkbox';
import { RadioGroup, RadioItem } from '../RadioGroup';
import { Slider } from '../Slider';
import { DatePicker } from '../DatePicker';
import { Calendar } from '../Calendar';
import { FileUpload } from '../FileUpload';
import { TagInput } from '../TagInput';

describe('Inputs (smoke)', () => {
  it('Textarea renders with label', () => {
    render(<Textarea label="Notes" placeholder="Type…" />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('Textarea is axe-clean', async () => {
    const { container } = render(<Textarea label="Notes" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Select renders trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger placeholder="Pick one" />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  function ComboDemo() {
    const [v, setV] = useState<string | null>(null);
    return (
      <Combobox
        value={v}
        onChange={setV}
        options={[
          { value: 'a', label: 'Apple' },
          { value: 'b', label: 'Banana' },
        ]}
      />
    );
  }
  it('Combobox renders', () => {
    render(<ComboDemo />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  function MultiDemo() {
    const [v, setV] = useState<string[]>([]);
    return <MultiSelect value={v} onChange={setV} options={[{ value: 'a', label: 'A' }]} />;
  }
  it('MultiSelect renders empty', () => {
    const { container } = render(<MultiDemo />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Checkbox renders with label + toggles', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Agree" />);
    const cb = screen.getByLabelText('Agree');
    expect(cb).not.toBeChecked();
    await user.click(cb);
    expect(cb).toBeChecked();
  });

  it('Checkbox is axe-clean', async () => {
    const { container } = render(<Checkbox label="Agree" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('RadioGroup renders items', () => {
    render(
      <RadioGroup defaultValue="a">
        <RadioItem value="a" label="A" />
        <RadioItem value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByLabelText('A')).toBeChecked();
    expect(screen.getByLabelText('B')).not.toBeChecked();
  });

  it('RadioGroup is axe-clean', async () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioItem value="a" label="A" />
        <RadioItem value="b" label="B" />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Slider renders', () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('DatePicker renders trigger', () => {
    render(<DatePicker onChange={() => {}} placeholder="Pick a date" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('Calendar renders grid', () => {
    render(<Calendar mode="single" />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('FileUpload renders drop zone + hint', () => {
    render(<FileUpload hint="PDF" />);
    expect(screen.getByText('PDF')).toBeInTheDocument();
    // The drop zone wraps a hidden native file input.
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('TagInput renders chips', () => {
    render(<TagInput defaultValue={['react', 'typescript']} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });
});
