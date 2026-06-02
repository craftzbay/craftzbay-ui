import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Home } from '../../../icons';
import { Breadcrumbs } from '../Breadcrumbs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs';
import { Stepper } from '../Stepper';
import { Sidebar, SidebarItem, SidebarSection } from '../Sidebar';
import { TopNav, TopNavLink } from '../TopNav';

describe('Navigation (smoke)', () => {
  it('Breadcrumbs renders nav landmark', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Projects', href: '/' },
          { label: 'Atlas' },
        ]}
      />,
    );
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByText('Atlas')).toBeInTheDocument();
  });

  it('Breadcrumbs is axe-clean', async () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: 'A', href: '/' }, { label: 'B' }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Tabs renders triggers + active content', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Alpha</TabsContent>
        <TabsContent value="b">Beta</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'A' })).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('Tabs is axe-clean', async () => {
    const { container } = render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Body</TabsContent>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Stepper renders steps', () => {
    render(
      <Stepper
        current={1}
        steps={[
          { title: 'One' },
          { title: 'Two' },
          { title: 'Three' },
        ]}
      />,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  it('Sidebar renders sections + items', () => {
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem icon={<Home />} active>
            Home
          </SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('TopNav renders all slots', () => {
    render(
      <TopNav
        logo={<span>Atlas</span>}
        nav={
          <nav>
            <TopNavLink href="#" active>
              Home
            </TopNavLink>
          </nav>
        }
        actions={<span>actions</span>}
      />,
    );
    expect(screen.getByText('Atlas')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('actions')).toBeInTheDocument();
  });
});
