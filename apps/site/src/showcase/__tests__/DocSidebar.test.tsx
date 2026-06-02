import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocSidebar } from '../layout/DocSidebar';

const componentSections = [
  {
    title: 'Components',
    kind: 'component' as const,
    entries: [
      { slug: 'button', label: 'Button', group: 'Buttons' },
      { slug: 'icon-button', label: 'IconButton', group: 'Buttons' },
      { slug: 'input', label: 'Input', group: 'Inputs' },
      { slug: 'dialog', label: 'Dialog', group: 'Overlays' },
    ],
  },
];

const crossKind = [
  {
    title: 'Templates',
    kind: 'template' as const,
    entries: [
      { slug: 'auth-signin', label: 'Sign in', group: 'Templates' },
      { slug: 'dashboard', label: 'Dashboard', group: 'Templates' },
    ],
  },
  {
    title: 'Guides',
    kind: 'guide' as const,
    entries: [
      { slug: 'quickstart', label: 'Quick start', group: 'Guides' },
      { slug: 'theming', label: 'Theming', group: 'Guides' },
    ],
  },
];

describe('DocSidebar', () => {
  it('renders all entries when query is empty', () => {
    render(<DocSidebar sections={componentSections} />);
    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(screen.getByText('IconButton')).toBeInTheDocument();
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('Dialog')).toBeInTheDocument();
  });

  it('filters by label when a query is typed', async () => {
    const user = userEvent.setup();
    render(<DocSidebar sections={componentSections} />);
    await user.type(screen.getByPlaceholderText('Search…'), 'but');

    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(screen.getByText('IconButton')).toBeInTheDocument();
    expect(screen.queryByText('Input')).not.toBeInTheDocument();
    expect(screen.queryByText('Dialog')).not.toBeInTheDocument();
  });

  it('shows results from cross-kind sections when searching', async () => {
    const user = userEvent.setup();
    render(
      <DocSidebar sections={componentSections} crossKindSections={crossKind} />,
    );
    await user.type(screen.getByPlaceholderText('Search…'), 'dash');

    // Templates result surfaces while user is on the Components sidebar
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    // No component match for 'dash', so component entries are hidden
    expect(screen.queryByText('Button')).not.toBeInTheDocument();
  });

  it('does NOT show cross-kind entries when the query is empty', () => {
    render(
      <DocSidebar sections={componentSections} crossKindSections={crossKind} />,
    );
    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Quick start')).not.toBeInTheDocument();
  });

  it('shows a "no matches" message when nothing matches', async () => {
    const user = userEvent.setup();
    render(<DocSidebar sections={componentSections} crossKindSections={crossKind} />);
    await user.type(screen.getByPlaceholderText('Search…'), 'xyzzy');

    expect(screen.getByText(/No matches/i)).toBeInTheDocument();
  });
});
