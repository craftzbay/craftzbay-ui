import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot, type Root } from 'react-dom/client';
import {
  Calendar,
  DatePicker,
  DesignSystemProvider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
  Kbd,
  LineChart,
  RelativeTime,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  useMediaQuery,
  useModifierKey,
} from '../index';
import { mnStrings } from '../lib/strings.mn';

/**
 * Components whose output depends on the clock, the platform, or media
 * queries must produce identical markup on the server and on the first client
 * render — React 18 warns on any mismatch via console.error.
 */

const MISMATCH = /hydrat|did not match|Expected server HTML|Text content does not match/i;

function MediaConsumer() {
  const wide = useMediaQuery('(min-width: 1024px)');
  return <span>{wide ? 'wide' : 'narrow'}</span>;
}

function ModifierConsumer() {
  const { symbol, label } = useModifierKey();
  return <Kbd aria-label={`${label} K`}>{symbol}K</Kbd>;
}

const now = new Date('2026-08-20T10:00:00Z');

const trees: Record<string, () => ReactElement> = {
  RelativeTime: () => <RelativeTime date="2026-08-20T09:55:00Z" now={now} />,
  DatePicker: () => <DatePicker value={new Date(2026, 7, 20)} onChange={() => {}} />,
  Calendar: () => <Calendar mode="single" defaultMonth={new Date(2026, 7, 1)} />,
  Toaster: () => <Toaster />,
  Input: () => (
    <Input label="Email" type="email" helperText="Work email" clearable defaultValue="a@b.c" />
  ),
  'Input password': () => <Input label="Password" type="password" defaultValue="secret" />,
  Skeleton: () => <Skeleton delay={0} variant="text" className="w-24" />,
  'Skeleton delayed': () => <Skeleton variant="text" className="w-24" />,
  Chart: () => (
    <LineChart
      caption="Revenue"
      data={[
        { x: 'Jan', y: 10 },
        { x: 'Feb', y: 20 },
      ]}
      showTableToggle
    />
  ),
  useMediaQuery: () => <MediaConsumer />,
  useModifierKey: () => <ModifierConsumer />,
  Sidebar: () => (
    <Sidebar>
      <SidebarSection label="Main">
        <SidebarItem href="/" active>
          Home
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  ),
  Tabs: () => (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel</TabsContent>
    </Tabs>
  ),
  'Dialog (closed)': () => (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Title</DialogTitle>
      </DialogContent>
    </Dialog>
  ),
};

describe('hydration: server markup matches first client render', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let container: HTMLDivElement;
  let root: Root | null = null;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(async () => {
    if (root) {
      await act(async () => root!.unmount());
      root = null;
    }
    container.remove();
    errorSpy.mockRestore();
  });

  describe.each(Object.keys(trees))('%s', (name) => {
    it.each([
      ['default strings', undefined],
      ['mnStrings', mnStrings],
    ])('hydrates without mismatch warnings (%s)', async (_label, strings) => {
      const tree = <DesignSystemProvider strings={strings}>{trees[name]()}</DesignSystemProvider>;
      const html = renderToString(tree);
      // React 18 warns about useLayoutEffect during renderToString in a DOM
      // environment; that is noise from the test setup, not a mismatch.
      errorSpy.mockClear();
      container.innerHTML = html;
      const recoverable: string[] = [];
      await act(async () => {
        root = hydrateRoot(container, tree, {
          onRecoverableError: (err) => recoverable.push(String(err)),
        });
      });
      expect(collectMismatches(errorSpy)).toEqual([]);
      expect(recoverable).toEqual([]);
    });
  });

  it('negative control: the harness does catch a real mismatch', async () => {
    let n = 0;
    function Unstable() {
      return <span>{++n}</span>;
    }
    const tree = <Unstable />;
    container.innerHTML = renderToString(tree);
    errorSpy.mockClear();
    await act(async () => {
      root = hydrateRoot(container, tree, { onRecoverableError: () => {} });
    });
    expect(collectMismatches(errorSpy).length).toBeGreaterThan(0);
  });
});

function collectMismatches(spy: { mock: { calls: unknown[][] } }): string[] {
  return spy.mock.calls.map((c) => c.map(String).join(' ')).filter((m) => MISMATCH.test(m));
}
