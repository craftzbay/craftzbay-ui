import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'card',
  name: 'Card',
  group: 'Layout',
  description:
    'Container surface for grouped content. Compose with CardHeader / CardTitle / CardDescription / CardContent / CardFooter — none are required, but the structure keeps spacing consistent across the app.',
  exports: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
  sourceFile: 'Card.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Project Atlas</CardTitle>
            <CardDescription>4 contributors · updated 2 hours ago</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground-muted">
              A small dashboard project tracking team activity across repos.
            </p>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" size="sm">Open</Button>
            <Button size="sm">View report</Button>
          </CardFooter>
        </Card>
      ),
      code: `<Card>
  <CardHeader>
    <CardTitle>Project Atlas</CardTitle>
    <CardDescription>4 contributors · updated 2 hours ago</CardDescription>
  </CardHeader>
  <CardContent>
    <p>A small dashboard project tracking team activity across repos.</p>
  </CardContent>
  <CardFooter className="justify-end gap-2">
    <Button variant="ghost">Open</Button>
    <Button>View report</Button>
  </CardFooter>
</Card>`,
    },
    {
      title: 'Interactive',
      description: 'variant="interactive" adds hover + focus-visible affordances so the whole card reads as a link target. Wrap an <a> inside for proper link semantics.',
      preview: (
        <a href="#" className="block w-full max-w-sm no-underline">
          <Card variant="interactive">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Beacon
                <Badge tone="warning">Paused</Badge>
              </CardTitle>
              <CardDescription>Open dashboard ↗</CardDescription>
            </CardHeader>
          </Card>
        </a>
      ),
      code: `<a href="/projects/beacon" className="block no-underline">
  <Card variant="interactive">
    <CardHeader>
      <CardTitle>Project Beacon</CardTitle>
      <CardDescription>Open dashboard ↗</CardDescription>
    </CardHeader>
  </Card>
</a>`,
    },
    {
      title: 'Compact / no padding',
      preview: (
        <Card padding="none" className="w-full max-w-sm">
          <img
            alt=""
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect width='400' height='200' fill='%23eef2ff'/><text x='200' y='105' fill='%236366f1' text-anchor='middle' font-family='sans-serif' font-size='14'>Cover image</text></svg>"
            className="block w-full"
          />
          <div className="p-4">
            <CardTitle>Edge-to-edge media</CardTitle>
            <CardDescription>padding="none" + manual inner padding.</CardDescription>
          </div>
        </Card>
      ),
      code: `<Card padding="none">
  <img src="…" className="block w-full" />
  <div className="p-4">
    <CardTitle>Edge-to-edge media</CardTitle>
    <CardDescription>padding="none" + manual inner padding.</CardDescription>
  </div>
</Card>`,
    },
  ],
  api: [
    {
      title: 'Card',
      rows: [
        { name: 'variant', type: `'default' | 'interactive'`, default: `'default'`, description: 'Interactive adds hover + focus-visible affordance.' },
        { name: 'padding', type: `'none' | 'sm' | 'md' | 'lg'`, default: `'md'`, description: 'Inner padding preset.' },
      ],
    },
    {
      title: 'Sub-components',
      rows: [
        { name: 'CardHeader', type: 'component', description: 'Top region — wraps Title / Description.' },
        { name: 'CardTitle', type: 'component', description: 'h3 by default.' },
        { name: 'CardDescription', type: 'component', description: 'Muted body line under the title.' },
        { name: 'CardContent', type: 'component', description: 'Main body region.' },
        { name: 'CardFooter', type: 'component', description: 'Bottom action region.' },
      ],
    },
  ],
  accessibility: [
    'Wrap an interactive Card in an <a> or <button> for correct link / button semantics — do not put an onClick on the Card div alone.',
  ],
  related: [
    { slug: 'separator', reason: 'For dividing sections inside a Card.' },
  ],
};

export default doc;
