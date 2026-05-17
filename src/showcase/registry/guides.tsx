import type { GuideDoc } from './types';
import { CodeBlock } from '../widgets/CodeBlock';

/* -----------------------------------------------------------------------------
 *  Long-form guides. Each guide's body is JSX written here directly — small
 *  enough that a dedicated MDX pipeline is not worth its weight.
 *
 *  Stage 3 will expand these with live demos and per-section anchors.
 * --------------------------------------------------------------------------- */

const quickstart: GuideDoc = {
  slug: 'quickstart',
  title: 'Quick start',
  description: 'Install the package, import the stylesheet, render your first component.',
  body: (
    <div className="prose-block">
      <h2>1. Install</h2>
      <CodeBlock language="bash" code="pnpm add @craftzbay/ui" />
      <p>
        Peer dependencies: <code>react@&gt;=18</code>, <code>react-dom@&gt;=18</code>. Already in your app — no extra setup.
      </p>

      <h2>2. Import the stylesheet</h2>
      <p>Once, at the top of your app entry:</p>
      <CodeBlock code={`import '@craftzbay/ui/styles.css';`} />

      <h2>3. Use a component</h2>
      <CodeBlock
        code={`import { Button, Dialog, DialogContent, DialogTrigger, DialogTitle } from '@craftzbay/ui';

export function ExportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Export…</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Export workspace</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}`}
      />

      <h2>4. Dark mode</h2>
      <p>
        Toggle the <code>dark</code> class on any container — usually <code>&lt;html&gt;</code>. All token-coloured surfaces flip automatically.
      </p>
      <CodeBlock code={`document.documentElement.classList.toggle('dark');`} />
    </div>
  ),
};

const theming: GuideDoc = {
  slug: 'theming',
  title: 'Theming',
  description: 'Change the brand colour, fonts, and surfaces — globally or per subtree.',
  body: (
    <div className="prose-block">
      <h2>Global override</h2>
      <p>
        All design tokens are CSS variables declared in <code>@craftzbay/ui/styles.css</code> via Tailwind v4's <code>@theme</code> block. Override them in your own CSS:
      </p>
      <CodeBlock
        language="css"
        code={`/* your-app.css — load AFTER @craftzbay/ui/styles.css */
:root {
  --accent: oklch(0.62 0.21 260);          /* swap brand accent */
  --accent-soft: oklch(0.94 0.04 260);
  --on-accent: white;
  --radius-sm: 4px;
  --font-sans: 'Inter', system-ui, sans-serif;
}`}
      />

      <h2>Per-subtree override</h2>
      <p>
        <code>DesignSystemProvider</code> applies any token override to a scoped subtree only. Useful for white-labelled embeds, A/B tests, or brand previews.
      </p>
      <CodeBlock
        code={`import { DesignSystemProvider, brandPresets } from '@craftzbay/ui';

<DesignSystemProvider brand={brandPresets.forest}>
  <App />
</DesignSystemProvider>`}
      />
      <p>
        Built-in presets: <code>default</code>, <code>edgelog</code>, <code>gerege</code>, <code>forest</code>. Pass your own <code>{`{ accent, accentSoft, onAccent, … }`}</code> object for anything else.
      </p>
    </div>
  ),
};

const accessibility: GuideDoc = {
  slug: 'accessibility',
  title: 'Accessibility',
  description: 'WCAG AA contrast, keyboard nav, focus management, and screen-reader expectations.',
  body: (
    <div className="prose-block">
      <h2>Built-in guarantees</h2>
      <ul>
        <li>WCAG AA contrast on every token pair (light + dark).</li>
        <li>Visible focus ring on every interactive element (<code>:focus-visible</code>).</li>
        <li>Keyboard parity — every action reachable without a mouse.</li>
        <li>All overlays (Dialog, Sheet, Popover, …) trap and restore focus correctly via Radix.</li>
        <li><code>prefers-reduced-motion</code> respected — animations downgrade to subtle fades.</li>
      </ul>

      <h2>What you must do</h2>
      <ul>
        <li>Always pass <code>aria-label</code> to <code>IconButton</code> (TypeScript enforces it).</li>
        <li>Provide an <code>alt</code> on <code>Avatar</code> images; <code>fallback</code> initials are required.</li>
        <li>Inside a <code>Dialog</code>, always render <code>DialogTitle</code> — Radix will warn otherwise.</li>
        <li>For <code>Input</code>, set <code>label</code> (use <code>hideLabel</code> to visually hide but stay in the a11y tree).</li>
      </ul>
    </div>
  ),
};

const forms: GuideDoc = {
  slug: 'forms',
  title: 'Forms (react-hook-form)',
  description: 'Use Form + FormField for consistent labels, errors, and validation across every input primitive.',
  body: (
    <div className="prose-block">
      <h2>Why react-hook-form</h2>
      <p>
        Battle-tested, fast (no re-render storm), tiny, and works with any validation library (Zod, Yup, Joi, custom). All <code>@craftzbay/ui</code> inputs forward refs correctly, so they slot into RHF without adapters.
      </p>

      <h2>Sign-in example</h2>
      <CodeBlock
        code={`import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Button } from '@craftzbay/ui';

const form = useForm({ defaultValues: { email: '', password: '' } });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      rules={{ required: 'Required', pattern: /\\S+@\\S+\\.\\S+/ }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Sign in</Button>
  </form>
</Form>`}
      />

      <h2>With Zod</h2>
      <CodeBlock
        code={`import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({ resolver: zodResolver(schema) });`}
      />
    </div>
  ),
};

const darkMode: GuideDoc = {
  slug: 'dark-mode',
  title: 'Dark mode',
  description: 'How dark mode is implemented and how to wire a toggle.',
  body: (
    <div className="prose-block">
      <h2>How it works</h2>
      <p>
        Tokens are declared in two scopes: <code>:root</code> for light, <code>.dark</code> for dark. Toggling the <code>dark</code> class on any ancestor flips all descendant tokens. No JS in the library — no flash.
      </p>

      <h2>Toggle implementation</h2>
      <CodeBlock
        code={`function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) };
}`}
      />

      <h2>Avoid the flash</h2>
      <p>Add this script before your bundle so the class is set before first paint:</p>
      <CodeBlock
        language="html"
        code={`<script>
  (function() {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>`}
      />
    </div>
  ),
};

const responsive: GuideDoc = {
  slug: 'responsive',
  title: 'Responsive design',
  description: 'Breakpoints, mobile-first patterns, and component-specific responsive behavior.',
  body: (
    <div className="prose-block">
      <h2>Breakpoints (Tailwind v4 defaults)</h2>
      <ul>
        <li><code>sm</code> — 640px</li>
        <li><code>md</code> — 768px</li>
        <li><code>lg</code> — 1024px</li>
        <li><code>xl</code> — 1280px</li>
        <li><code>2xl</code> — 1536px</li>
      </ul>

      <h2>Components with built-in responsive behavior</h2>
      <ul>
        <li><b>Sidebar</b> — collapses to icon-only at <code>md</code>. Use <code>useSidebar()</code> to react to collapsed state.</li>
        <li><b>Dialog</b> — full-screen on mobile (~&lt; 640px), centered modal on larger.</li>
        <li><b>Sheet</b> — Right side often switches to a Drawer on touch devices. Decide based on intent.</li>
        <li><b>TopNav</b> — collapses to a menu icon on <code>sm</code> if you provide a mobile slot.</li>
      </ul>

      <h2>useMediaQuery hook</h2>
      <CodeBlock
        code={`import { useMediaQuery } from '@craftzbay/ui';

const isMobile = useMediaQuery('(max-width: 640px)');
return isMobile ? <Drawer>…</Drawer> : <Sheet>…</Sheet>;`}
      />
    </div>
  ),
};

export const guideDocs: GuideDoc[] = [
  quickstart,
  theming,
  accessibility,
  forms,
  darkMode,
  responsive,
];

export function getGuideDoc(slug: string): GuideDoc | undefined {
  return guideDocs.find((g) => g.slug === slug);
}
