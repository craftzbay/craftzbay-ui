import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'dashboard',
  name: 'Dashboard',
  description: 'AppShell with Sidebar + TopBar + main content. Drop your stat cards / charts / activity tables inside.',
  exports: ['AppShell', 'Dashboard'],
  sourceFile: 'AppShell.tsx',
  previewSlug: 'dashboard',
  useCases: ['Admin dashboard', 'SaaS analytics home', 'Internal back-office'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/dashboard">full-page preview ↗</a>.
        </div>
      ),
      code: `<AppShell
  brand={<Logo />}
  sidebar={
    <Sidebar>
      <SidebarSection>
        <SidebarItem icon={<Home />} active>Home</SidebarItem>
        <SidebarItem icon={<Folder />}>Projects</SidebarItem>
      </SidebarSection>
    </Sidebar>
  }
  topbar={<TopBar />}
>
  <Dashboard stats={[…]} chart={…} activity={…} />
</AppShell>`,
    },
  ],
};

export default doc;
