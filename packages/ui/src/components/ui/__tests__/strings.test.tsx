import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesignSystemProvider, type DesignSystemProviderProps } from '../DesignSystemProvider';
import { Dialog, DialogContent, DialogTitle } from '../Dialog';
import { Pagination } from '../Pagination';
import { Combobox } from '../Combobox';
import { mnStrings } from '@/lib/strings.mn';
import { defaultStrings, formatString, mergeStrings } from '@/lib/strings';

type Strings = DesignSystemProviderProps['strings'];

// The modal Dialog aria-hides its siblings, so it gets its own render.
function renderDialog(strings?: Strings) {
  return render(
    <DesignSystemProvider strings={strings}>
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    </DesignSystemProvider>,
  );
}

function renderInline(strings?: Strings) {
  return render(
    <DesignSystemProvider strings={strings}>
      <Pagination page={2} pageCount={5} onPageChange={() => {}} totalItems={100} pageSize={20} />
      <Combobox value={null} onChange={() => {}} options={[]} label="Pick" />
    </DesignSystemProvider>,
  );
}

describe('UI strings', () => {
  it('renders English defaults without overrides', () => {
    renderDialog();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('renders English defaults without a provider', () => {
    render(
      <Pagination page={2} pageCount={5} onPageChange={() => {}} totalItems={100} pageSize={20} />,
    );
    expect(screen.getByText('Showing 21–40 of 100')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
  });

  it('switches to Mongolian via DesignSystemProvider', () => {
    renderDialog(mnStrings);
    expect(screen.getByRole('button', { name: 'Хаах' })).toBeInTheDocument();
  });

  it('translates Pagination + Combobox to Mongolian', () => {
    renderInline(mnStrings);
    expect(screen.getByText('21–40 / 100')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Хуудаслалт' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Өмнөх хуудас' })).toBeInTheDocument();
    expect(screen.getByText('Сонгох…')).toBeInTheDocument();
  });

  it('merges partial overrides over defaults', () => {
    renderDialog({ dialog: { close: 'Shut' } });
    expect(screen.getByRole('button', { name: 'Shut' })).toBeInTheDocument();
    renderInline({ dialog: { close: 'Shut' } });
    expect(screen.getByText('Showing 21–40 of 100')).toBeInTheDocument();
  });

  it('lets per-component props win over context', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Pagination
          page={1}
          pageCount={2}
          onPageChange={() => {}}
          labels={{ prev: 'Back' }}
          aria-label="Custom"
        />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Custom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Дараах хуудас' })).toBeInTheDocument();
  });

  it('helpers: format + merge', () => {
    expect(formatString('{a} of {b} {c}', { a: 1, b: 'x' })).toBe('1 of x {c}');
    const merged = mergeStrings(defaultStrings, { alert: { dismiss: 'X' } });
    expect(merged.alert.dismiss).toBe('X');
    expect(merged.dialog.close).toBe('Close');
    expect(Object.keys(mnStrings).sort()).toEqual(Object.keys(defaultStrings).sort());
  });
});
