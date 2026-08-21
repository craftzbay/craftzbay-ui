import { describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { useToast } from '@/hooks/use-toast';
import { mergeStrings, defaultStrings } from '@/lib/strings';
import { Combobox } from '../Combobox';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { RadioGroup, RadioItem } from '../RadioGroup';
import { Switch } from '../Switch';
import { Button } from '../Button';
import { Calendar } from '../Calendar';
import { Alert } from '../Alert';
import { Slider } from '../Slider';
import { useState } from 'react';

describe('useToast', () => {
  it('updates a toast in place when pushed with an existing id', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.push({ id: 'save', title: 'Saving…' });
    });
    act(() => {
      result.current.push({ id: 'save', title: 'Saved', variant: 'success' });
    });
    const matching = result.current.toasts.filter((t) => t.id === 'save');
    expect(matching).toHaveLength(1);
    expect(matching[0].title).toBe('Saved');
    expect(matching[0].variant).toBe('success');
    act(() => result.current.remove('save'));
  });

  it('never evicts duration: 0 toasts when the queue overflows', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.push({ id: 'sticky', title: 'Offline', duration: 0 });
      for (let i = 0; i < 5; i++) result.current.push({ id: `n${i}`, title: `n${i}` });
    });
    const ids = result.current.toasts.map((t) => t.id);
    expect(ids).toContain('sticky');
    expect(ids.filter((id) => id !== 'sticky')).toHaveLength(3);
    act(() => result.current.toasts.forEach((t) => result.current.remove(t.id)));
  });
});

describe('mergeStrings', () => {
  it('deep-merges and ignores undefined leaves', () => {
    const merged = mergeStrings(defaultStrings, {
      combobox: { empty: 'Nothing', clear: undefined },
    });
    expect(merged.combobox.empty).toBe('Nothing');
    expect(merged.combobox.clear).toBe('Clear selection');
    expect(merged.combobox.placeholder).toBe('Select…');
  });
});

describe('Combobox filtering', () => {
  const options = [
    { value: 'id-1', label: 'Apple' },
    { value: 'id-2', label: 'Banana' },
  ];
  function Demo() {
    const [v, setV] = useState<string | null>(null);
    return <Combobox label="Fruit" options={options} value={v} onChange={setV} />;
  }

  it('filters by label, not by value, and shows the empty state for no match', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const search = await screen.findByPlaceholderText('Search…');
    await user.type(search, 'ban');
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.queryByText('No results.')).toBeNull();

    await user.clear(search);
    await user.type(search, 'zzz');
    expect(screen.queryByText('Apple')).toBeNull();
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('only sets aria-controls while open and points at a real element', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).not.toHaveAttribute('aria-controls');
    await user.click(trigger);
    await screen.findByPlaceholderText('Search…');
    const id = screen.getByRole('combobox', { name: 'Fruit' }).getAttribute('aria-controls');
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)).not.toBeNull();
  });

  it('surfaces a loadOptions rejection', async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        label="Remote"
        value={null}
        onChange={() => {}}
        loadOptions={() => Promise.reject(new Error('boom'))}
      />,
    );
    await user.click(screen.getByRole('combobox', { name: 'Remote' }));
    expect(await screen.findByText("Couldn't load options.")).toBeInTheDocument();
  });
});

describe('aria-describedby merging', () => {
  it('Input appends the consumer id after the helper id', () => {
    render(
      <>
        <Input label="Email" helperText="Work email" aria-describedby="ext" />
        <p id="ext">External</p>
      </>,
    );
    const ids = screen.getByLabelText('Email').getAttribute('aria-describedby')!.split(' ');
    expect(ids).toHaveLength(2);
    expect(ids[1]).toBe('ext');
    expect(document.getElementById(ids[0])).toHaveTextContent('Work email');
    expect(ids[0].endsWith('-desc')).toBe(true);
  });

  it('Textarea, Checkbox, RadioItem and Switch keep consumer aria-describedby', () => {
    render(
      <>
        <p id="ext">External</p>
        <Textarea label="Notes" error="Required" aria-describedby="ext" />
        <Checkbox label="Agree" description="Terms" aria-describedby="ext" />
        <RadioGroup>
          <RadioItem value="a" label="A" description="First" aria-describedby="ext" />
        </RadioGroup>
        <Switch label="Wifi" description="Radio" aria-describedby="ext" />
      </>,
    );
    for (const name of ['Notes', 'Agree', 'A', 'Wifi']) {
      const el = screen.getByLabelText(name);
      const ids = el.getAttribute('aria-describedby')!.split(' ');
      expect(ids).toContain('ext');
      ids.forEach((id) => expect(document.getElementById(id)).not.toBeNull());
    }
    expect(screen.getByLabelText('Notes').getAttribute('aria-describedby')).toMatch(/-error ext$/);
  });

  it('hideLabel hides only the label, the description stays visible', () => {
    render(
      <>
        <Checkbox label="Agree" description="Terms apply" hideLabel />
        <Switch label="Wifi" description="Uses radio" hideLabel />
        <RadioGroup>
          <RadioItem value="a" label="A" description="First option" hideLabel />
        </RadioGroup>
      </>,
    );
    expect(screen.getByText('Agree')).toHaveClass('sr-only');
    expect(screen.getByText('Terms apply')).not.toHaveClass('sr-only');
    expect(screen.getByText('Terms apply').parentElement).not.toHaveClass('sr-only');
    expect(screen.getByText('Uses radio').parentElement).not.toHaveClass('sr-only');
    expect(screen.getByText('First option').parentElement).not.toHaveClass('sr-only');
  });

  it('Input accepts value={null} as an empty controlled value', () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Input label="Nullable" value={null} onChange={() => {}} />);
    expect(screen.getByLabelText('Nullable')).toHaveValue('');
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('Button loading', () => {
  it('keeps focus, is aria-disabled and swallows clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    btn.focus();
    expect(btn).toHaveFocus();
    rerender(
      <Button onClick={onClick} loading>
        Save
      </Button>,
    );
    expect(btn).toHaveFocus();
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('asChild loading blocks the child handler and navigation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button asChild loading>
        <a href="/x" onClick={onClick}>
          Go
        </a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    link.focus();
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('aria-busy', 'true');
  });

  it('has an xl size of 44px', () => {
    render(<Button size="xl">Start</Button>);
    expect(screen.getByRole('button').className).toContain('h-11');
  });
});

describe('Calendar', () => {
  it('styles the selected day through its cell', () => {
    const date = new Date(2026, 0, 15);
    render(<Calendar mode="single" selected={date} defaultMonth={date} />);
    const cell = document.querySelector('td[aria-selected="true"]');
    expect(cell).not.toBeNull();
    expect(cell!.className).toContain('[&_button]:bg-accent');
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
  });
});

describe('Alert', () => {
  it('is not a live region unless `live`', () => {
    const { rerender } = render(<Alert title="Note">Body</Alert>);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('heading', { level: 3, name: 'Note' })).toBeInTheDocument();
    rerender(
      <Alert title="Note" live variant="danger" headingLevel={4}>
        Body
      </Alert>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('supports controlled open', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Alert title="Note" dismissible open onOpenChange={onOpenChange}>
        Body
      </Alert>,
    );
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText('Note')).toBeInTheDocument();
  });
});

describe('Slider', () => {
  it('shows the live value when uncontrolled', async () => {
    render(<Slider label="Volume" showValue defaultValue={[10]} max={100} step={1} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByText('11')).toBeInTheDocument();
  });
});

describe('axe', () => {
  it('fields with merged descriptions are clean', async () => {
    const { container } = render(
      <div>
        <Input label="Email" helperText="Work email" />
        <Textarea label="Notes" error="Required" />
        <Checkbox label="Agree" description="Terms" />
        <Switch label="Wifi" description="Radio" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
