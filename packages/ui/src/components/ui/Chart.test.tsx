import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BarChart, LineChart, abbreviateNumber } from './Chart';

const data = [
  { x: 'Jan', y: 1200 },
  { x: 'Feb', y: 3400 },
  { x: 'Mar', y: 900 },
];

describe('Chart', () => {
  it('uses the caption as the accessible name and adds a desc summary', () => {
    render(<LineChart data={data} caption="Revenue" />);
    const svg = screen.getByRole('img', { name: 'Revenue' });
    const desc = svg.querySelector('desc');
    expect(desc?.textContent).toContain('min 900');
    expect(desc?.textContent).toContain('max 3400');
    expect(desc?.textContent).toContain('last Mar: 900');
  });

  it('falls back to aria-label / title and warns when nothing is given', () => {
    render(<BarChart data={data} aria-label="Signups" />);
    expect(screen.getByRole('img', { name: 'Signups' })).toBeInTheDocument();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<BarChart data={data} />);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('renders abbreviated y ticks and first/last x labels', () => {
    render(<LineChart data={data} caption="Revenue" />);
    expect(screen.getByText('3.4K')).toBeInTheDocument();
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
    expect(abbreviateNumber(3_400_000)).toBe('3.4M');
  });

  it('draws multiple series with distinct colours and no gradient', () => {
    const { container } = render(
      <LineChart
        caption="Two"
        series={[
          { name: 'A', data },
          { name: 'B', data: data.map((d) => ({ ...d, y: d.y / 2 })) },
        ]}
      />,
    );
    expect(container.querySelector('linearGradient')).toBeNull();
    const strokes = Array.from(container.querySelectorAll('path[stroke]')).map((p) =>
      p.getAttribute('stroke'),
    );
    expect(new Set(strokes).size).toBe(2);
  });

  it('is axe-clean', async () => {
    const { container } = render(
      <div>
        <LineChart data={data} caption="Revenue" />
        <BarChart data={data} aria-label="Signups" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
