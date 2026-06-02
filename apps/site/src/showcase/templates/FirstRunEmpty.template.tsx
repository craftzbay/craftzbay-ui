import type { TemplateDoc } from '../registry/types';

const doc: TemplateDoc = {
  slug: 'first-run',
  name: 'First-run empty',
  description: 'Welcoming "you have nothing here yet" page with hero + 3 next-step action cards. Use as the empty state for a brand-new workspace / project.',
  exports: ['FirstRunEmpty'],
  sourceFile: 'FirstRunEmpty.tsx',
  previewSlug: 'first-run',
  useCases: ['New workspace landing', 'Empty project home', 'Post-signup welcome'],
  examples: [
    {
      title: 'Usage',
      preview: (
        <div className="text-sm text-foreground-muted">
          Open the <a className="text-accent hover:underline" href="#preview/first-run">full-page preview ↗</a>.
        </div>
      ),
      code: `<FirstRunEmpty
  illustration={<Illustrations.InboxEmpty className="size-40" />}
  title="Welcome to Atlas"
  description="Let's get you set up. Pick a starting point."
  actions={[
    { icon: <Folder />, title: 'Create a project', description: 'Start from scratch', onClick: () => …  },
    { icon: <Github />, title: 'Import from Git', description: 'Pull in an existing repo', onClick: () => … },
    { icon: <Users />, title: 'Invite teammates', description: 'You don\\'t have to do this alone', onClick: () => … },
  ]}
/>`,
    },
  ],
};

export default doc;
