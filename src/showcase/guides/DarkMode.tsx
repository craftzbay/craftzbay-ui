import { useEffect, useState } from 'react';
import { Moon, Sun } from '@/icons';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CodeBlock } from '../widgets/CodeBlock';

function ThemeToggleDemo() {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document === 'undefined'
      ? false
      : document.documentElement.classList.contains('dark'),
  );

  // Keep state in sync with whatever the showcase ⌘K toggle / TopBar does.
  useEffect(() => {
    const root = document.documentElement;
    const obs = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-5">
        <div>
          <p className="text-sm font-medium text-foreground">Current theme</p>
          <p className="text-xs text-foreground-muted">
            Toggling here flips <code className="rounded bg-background-muted px-1 py-0.5">.dark</code> on{' '}
            <code className="rounded bg-background-muted px-1 py-0.5">&lt;html&gt;</code> — every token
            in the page responds.
          </p>
        </div>
        <Button onClick={toggle} variant="outline" leadingIcon={isDark ? <Sun /> : <Moon />}>
          {isDark ? 'Light' : 'Dark'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function DarkModeBody() {
  return (
    <div className="prose-block">
      <h2>How it works</h2>
      <p>
        Tokens are declared in two scopes: <code>:root</code> for light, <code>.dark</code> for
        dark. Toggling the <code>dark</code> class on any ancestor flips every descendant
        token. No JS in the library — no flash.
      </p>

      <h2>Live toggle</h2>
      <ThemeToggleDemo />

      <h2>Toggle hook</h2>
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
  );
}
