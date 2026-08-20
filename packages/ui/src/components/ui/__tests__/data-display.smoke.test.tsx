import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Avatar, AvatarGroup } from '../Avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table';
import { DataGrid, type DataGridColumn } from '../DataGrid';
import { Carousel, CarouselContent, CarouselItem } from '../Carousel';
import { Timeline, TimelineItem, TimelineTitle } from '../Timeline';
import { Tree } from '../Tree';
import { LineChart, BarChart } from '../Chart';
import { Kbd } from '../Kbd';

interface Row {
  id: string;
  name: string;
}

describe('Data Display (smoke)', () => {
  it('Avatar renders fallback initials', async () => {
    render(<Avatar fallback="AB" />);
    // Radix renders the fallback after an internal effect resolves image status.
    expect(await screen.findByText('AB')).toBeInTheDocument();
  });

  it('AvatarGroup respects max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar fallback="A" />
        <Avatar fallback="B" />
        <Avatar fallback="C" />
        <Avatar fallback="D" />
      </AvatarGroup>,
    );
    // 2 visible + the +N indicator
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('Table renders semantic table', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Atlas</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Atlas')).toBeInTheDocument();
  });

  it('Table is axe-clean', async () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Col</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Val</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('TableRow selected exposes aria-selected; TableHead uppercase is opt-in', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plain</TableHead>
            <TableHead uppercase>Caps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>Picked</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText('Picked').closest('tr')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Plain')).not.toHaveClass('uppercase');
    expect(screen.getByText('Caps')).toHaveClass('uppercase');
  });

  it('DataGrid renders rows', () => {
    const cols: DataGridColumn<Row>[] = [{ key: 'name', header: 'Name' }];
    render(<DataGrid rows={[{ id: '1', name: 'Atlas' }]} columns={cols} />);
    expect(screen.getByText('Atlas')).toBeInTheDocument();
  });

  it('Carousel renders slides', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>One</CarouselItem>
          <CarouselItem>Two</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('Timeline renders items', () => {
    render(
      <Timeline>
        <TimelineItem>
          <TimelineTitle>Merged PR</TimelineTitle>
        </TimelineItem>
      </Timeline>,
    );
    expect(screen.getByText('Merged PR')).toBeInTheDocument();
  });

  it('Tree renders nodes', () => {
    render(
      <Tree
        defaultExpanded={['src']}
        data={[
          {
            id: 'src',
            label: 'src',
            children: [{ id: 'index.ts', label: 'index.ts' }],
          },
        ]}
      />,
    );
    expect(screen.getByText('src')).toBeInTheDocument();
  });

  it('LineChart renders figure with caption', () => {
    render(
      <LineChart
        data={[
          { x: 0, y: 1 },
          { x: 1, y: 2 },
        ]}
        caption="Trend"
      />,
    );
    expect(screen.getByText('Trend')).toBeInTheDocument();
  });

  it('BarChart renders', () => {
    const { container } = render(
      <BarChart
        data={[
          { x: 0, y: 1 },
          { x: 1, y: 2 },
        ]}
        caption="Bars"
      />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('Charts are axe-clean with focusable points and a table fallback', async () => {
    const { container } = render(
      <div>
        <LineChart
          series={[
            {
              name: 'A',
              data: [
                { x: 'Jan', y: 1 },
                { x: 'Feb', y: 2 },
              ],
            },
          ]}
          caption="Trend"
          showTableToggle
        />
        <BarChart
          data={[
            { x: 0, y: 1 },
            { x: 1, y: 2 },
          ]}
          caption="Bars"
        />
      </div>,
    );
    const table = container.querySelector('table[data-chart-table]');
    expect(table).toHaveClass('sr-only');
    expect(table?.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(screen.getByRole('img', { name: 'A — Feb: 2' })).toHaveAttribute('tabindex', '0');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('LineChart breaks the path at null gaps and uses nice ticks', () => {
    const { container } = render(
      <LineChart
        data={[
          { x: 0, y: 100 },
          { x: 1, y: null },
          { x: 2, y: 754.5 },
          { x: 3, y: 300 },
        ]}
        caption="Gaps"
      />,
    );
    const line = container.querySelector('path[stroke]')!;
    expect(line.getAttribute('d')!.match(/M/g)).toHaveLength(2);
    const yTicks = Array.from(container.querySelectorAll('.tabular span')).map(
      (e) => e.textContent,
    );
    expect(yTicks).toEqual(['800', '600', '400', '200', '0']);
    expect(container.querySelectorAll('circle')).toHaveLength(3);
  });

  it('Chart state renders empty / error text instead of the SVG', () => {
    const { container, rerender } = render(<LineChart data={[]} caption="S" state="empty" />);
    expect(container.querySelector('svg')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('No data to display.');
    rerender(<LineChart data={[]} caption="S" state="error" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('Kbd renders inline kbd element', () => {
    render(<Kbd>⌘</Kbd>);
    expect(screen.getByText('⌘')).toBeInTheDocument();
  });
});
