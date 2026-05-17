import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { TopNav, TopNavLink } from './TopNav';

const meta: Meta = {
  title: 'Navigation/TopNav',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TopNav
      logo={<span className="text-sm font-semibold">Atlas</span>}
      nav={
        <nav className="flex items-center gap-4 text-sm">
          <TopNavLink href="#" active>Home</TopNavLink>
          <TopNavLink href="#">Projects</TopNavLink>
          <TopNavLink href="#">Team</TopNavLink>
        </nav>
      }
    >
      <Avatar fallback="BO" size="sm" />
    </TopNav>
  ),
};
