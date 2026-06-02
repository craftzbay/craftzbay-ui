import { Plus, Trash2, Download, ArrowRight } from '@/icons';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'button',
  name: 'Button',
  group: 'Buttons',
  description:
    'Primary interactive element. Use for the single most important action per screen; pair with Secondary or Outline for less prominent actions.',
  exports: ['Button'],
  sourceFile: 'Button.tsx',
  examples: [
    {
      title: 'Variants',
      description:
        'Six visual styles. Reserve "primary" for the one action you most want the user to take on a screen.',
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Learn more</Button>
        </div>
      ),
      code: `<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Learn more</Button>`,
    },
    {
      title: 'Sizes',
      description: 'sm for dense toolbars, md (default) for general use, lg for marketing CTAs.',
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      ),
      code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
    },
    {
      title: 'With icons',
      description:
        'leadingIcon and trailingIcon accept any ReactNode (Lucide icons recommended). Icons are auto-sized; do not set a className.',
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <Button leadingIcon={<Plus />}>New project</Button>
          <Button variant="outline" trailingIcon={<ArrowRight />}>
            Continue
          </Button>
          <Button variant="destructive" leadingIcon={<Trash2 />}>
            Delete
          </Button>
        </div>
      ),
      code: `<Button leadingIcon={<Plus />}>New project</Button>
<Button variant="outline" trailingIcon={<ArrowRight />}>
  Continue
</Button>
<Button variant="destructive" leadingIcon={<Trash2 />}>
  Delete
</Button>`,
    },
    {
      title: 'Loading',
      description:
        'Set loading to disable the button and show an inline spinner. Label stays visible so users know which action is in flight.',
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <Button loading>Saving…</Button>
          <Button variant="outline" loading leadingIcon={<Download />}>
            Exporting
          </Button>
        </div>
      ),
      code: `<Button loading>Saving…</Button>
<Button variant="outline" loading leadingIcon={<Download />}>
  Exporting
</Button>`,
    },
    {
      title: 'Disabled',
      preview: (
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled>Save</Button>
          <Button variant="outline" disabled>
            Cancel
          </Button>
        </div>
      ),
      code: `<Button disabled>Save</Button>
<Button variant="outline" disabled>Cancel</Button>`,
    },
    {
      title: 'Full width',
      description: 'Use for mobile primary actions or single-column forms.',
      preview: (
        <div className="w-full max-w-xs">
          <Button className="w-full">Sign in</Button>
        </div>
      ),
      code: `<Button className="w-full">Sign in</Button>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'variant',
          type: `'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'`,
          default: `'primary'`,
          description: 'Visual style.',
        },
        {
          name: 'size',
          type: `'sm' | 'md' | 'lg'`,
          default: `'md'`,
          description: 'Height + horizontal padding + text size.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description:
            'Shows an inline spinner and disables the button without removing it from the tab order.',
        },
        {
          name: 'leadingIcon',
          type: 'ReactNode',
          description: 'Icon rendered before the label. Sized automatically.',
        },
        {
          name: 'trailingIcon',
          type: 'ReactNode',
          description: 'Icon rendered after the label.',
        },
        {
          name: 'asChild',
          type: 'boolean',
          default: 'false',
          description:
            'Render the child element with Button styles applied. Use to make a link look like a button.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables interaction.',
        },
        {
          name: '…rest',
          type: 'ButtonHTMLAttributes<HTMLButtonElement>',
          description:
            'All standard button props (onClick, type, form, name, …) pass through.',
        },
      ],
    },
  ],
  accessibility: [
    'Renders as a real <button>; supports keyboard activation with Enter and Space.',
    'When loading=true the button is disabled but remains focusable so screen readers announce the new label.',
    'Use asChild to wrap an <a> so the link still receives proper Enter/Space semantics from the Button.',
    'For icon-only actions, prefer IconButton — it enforces aria-label at the type level.',
  ],
  related: [
    { slug: 'icon-button', reason: 'For icon-only actions.' },
    { slug: 'dropdown-menu', reason: 'Pair with a Button trigger for action menus.' },
  ],
};

export default doc;
