import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Slider } from './Slider';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

describe('Slider', () => {
  it('renders one thumb named by the string label with aria-value* set', () => {
    render(<Slider label="Volume" defaultValue={[60]} max={100} step={1} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toHaveAttribute('aria-valuenow', '60');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getAllByRole('slider')).toHaveLength(1);
  });

  it('uncontrolled showValue tracks the live value via keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider label="Volume" showValue defaultValue={[50]} step={5} onValueChange={onChange} />,
    );
    expect(screen.getByText('50')).toBeInTheDocument();
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '55');
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([55]);
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByText('45')).toBeInTheDocument();
    await user.keyboard('{End}');
    expect(screen.getByText('100')).toBeInTheDocument();
    await user.keyboard('{Home}');
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('controlled value follows state and formatValue applies', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [v, setV] = useState([20]);
      return (
        <Slider
          label="Price"
          showValue
          value={v}
          onValueChange={setV}
          step={10}
          formatValue={(n) => `$${n}`}
        />
      );
    }
    render(<Demo />);
    expect(screen.getByText('$20')).toBeInTheDocument();
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('$30')).toBeInTheDocument();
  });

  it('range: two thumbs labelled Minimum/Maximum and joined value text', () => {
    render(<Slider label="Range" showValue defaultValue={[10, 40]} />);
    const thumbs = screen.getAllByRole('slider');
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAccessibleName('Minimum');
    expect(thumbs[1]).toHaveAccessibleName('Maximum');
    expect(screen.getByText('10 – 40')).toBeInTheDocument();
  });

  it('falls back to aria-label, then the default "Value" label', () => {
    const { rerender } = render(<Slider aria-label="Opacity" defaultValue={[1]} />);
    expect(screen.getByRole('slider', { name: 'Opacity' })).toBeInTheDocument();
    rerender(<Slider defaultValue={[1]} />);
    expect(screen.getByRole('slider', { name: 'Value' })).toBeInTheDocument();
  });

  it('ReactNode label is referenced via aria-labelledby', () => {
    render(<Slider label={<em>Brightness</em>} defaultValue={[1]} />);
    expect(screen.getByRole('slider', { name: 'Brightness' })).toBeInTheDocument();
  });

  it('disabled thumb is not focusable via Tab', async () => {
    const user = userEvent.setup();
    render(<Slider label="V" defaultValue={[1]} disabled />);
    await user.tab();
    expect(screen.getByRole('slider')).not.toHaveFocus();
    expect(screen.getByRole('slider')).toHaveAttribute('data-disabled');
  });

  it('uses Mongolian thumb labels from the provider', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Slider defaultValue={[1, 2]} />
        <Slider defaultValue={[3]} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('slider', { name: 'Доод хязгаар' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Дээд хязгаар' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Утга' })).toBeInTheDocument();
  });

  it('forwards ref to the root; className goes on the wrapper; props spread', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <Slider ref={ref} label="V" defaultValue={[1]} className="w-64" data-testid="sl" />,
    );
    expect(ref.current).toHaveAttribute('data-testid', 'sl');
    expect(ref.current).toHaveClass('touch-none');
    expect(container.firstElementChild).toHaveClass('w-64', 'flex-col');
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <div>
        <Slider label="Volume" showValue defaultValue={[60]} />
        <Slider label="Range" defaultValue={[10, 40]} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
