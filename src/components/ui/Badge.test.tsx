import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders all tone variants with sufficient contrast', async () => {
    const { container } = render(
      <div>
        {(['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const).map((t) => (
          <Badge key={t} tone={t}>
            {t}
          </Badge>
        ))}
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
