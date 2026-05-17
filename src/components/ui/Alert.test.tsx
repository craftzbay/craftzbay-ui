import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Alert } from './Alert';

describe('Alert', () => {
  it('has role="alert"', () => {
    render(<Alert title="Saved">All changes published.</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders title and body', () => {
    render(<Alert title="Saved">All changes published.</Alert>);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('All changes published.')).toBeInTheDocument();
  });

  it('all variants pass axe', async () => {
    const { container } = render(
      <div>
        <Alert variant="info" title="Info">Heads up.</Alert>
        <Alert variant="success" title="Success">Saved.</Alert>
        <Alert variant="warning" title="Warn">Quota.</Alert>
        <Alert variant="danger" title="Danger">Error.</Alert>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
