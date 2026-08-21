import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { componentDocs, getComponentDoc } from '../registry/components';
import { LEGACY_REDIRECTS } from '../routing';
import { blockMeta } from '../blocks/meta';

const UI_SRC = path.resolve(__dirname, '../../../../../packages/ui/src');

/**
 * PascalCase exports from the library barrel that are deliberately NOT a doc
 * page of their own: compositional sub-parts documented on their parent's page,
 * constants, and illustration / icon namespaces.
 */
const ALLOWLIST = new Set<string>([
  // Namespaces + constants
  'Icons',
  'Illustrations',
  'DEFAULT_CHART_COLORS',
  'TOAST_DURATIONS',
  // Radix pass-through parts covered by the parent page
  'DialogOverlay',
  'DialogPortal',
  'SheetPortal',
  'SheetFooter',
  'SheetDescription',
  'DrawerPortal',
  'DrawerOverlay',
  'PopoverAnchor',
  'PopoverClose',
  'TooltipRoot',
  'ToastAction',
  'ToastClose',
  'DropdownMenuGroup',
  'DropdownMenuPortal',
  'DropdownMenuSub',
  'DropdownMenuRadioGroup',
  'DropdownMenuSubTrigger',
  'DropdownMenuSubContent',
  'DropdownMenuShortcut',
  'ContextMenuGroup',
  'ContextMenuPortal',
  'ContextMenuSub',
  'ContextMenuRadioGroup',
  'ContextMenuSubTrigger',
  'ContextMenuSubContent',
  'ContextMenuShortcut',
  'SelectScrollUpButton',
  'SelectScrollDownButton',
  'SelectLabel',
  'SelectSeparator',
  'CommandShortcut',
  'CommandSeparator',
  'CarouselPrevious',
  'CarouselNext',
  'ScrollBar',
  'FormDescription',
  'TimelineTime',
  'TimelineDescription',
]);

function read(rel: string): string {
  return fs.readFileSync(path.join(UI_SRC, rel), 'utf8');
}

/** Resolve `export * from './x'` + `export { a, b } from './x'` in the barrel to a flat name list. */
function barrelExports(): string[] {
  const index = read('index.ts');
  const names = new Set<string>();
  for (const m of index.matchAll(/^export \* from '(\.\/[^']+)';/gm)) {
    const file = m[1].endsWith('.ts') || m[1].endsWith('.tsx') ? m[1] : resolveModule(m[1]);
    const src = read(file);
    for (const d of src.matchAll(/^export (?:const|function|class) ([A-Za-z0-9_]+)/gm))
      names.add(d[1]);
    for (const d of src.matchAll(/^export \{([^}]+)\}/gm))
      for (const part of d[1].split(','))
        names.add(
          part
            .trim()
            .split(/\s+as\s+/)
            .pop()!
            .trim(),
        );
  }
  for (const m of index.matchAll(/^export \{([^}]+)\} from/gm))
    for (const part of m[1].split(',')) {
      const trimmed = part.trim();
      if (!trimmed || trimmed.startsWith('type ')) continue;
      names.add(
        trimmed
          .split(/\s+as\s+/)
          .pop()!
          .trim(),
      );
    }
  for (const m of index.matchAll(/^export \* as ([A-Za-z]+) from/gm)) names.add(m[1]);
  return [...names].filter(Boolean);
}

function resolveModule(rel: string): string {
  for (const ext of ['.tsx', '.ts', '/index.ts']) {
    if (fs.existsSync(path.join(UI_SRC, rel + ext))) return rel + ext;
  }
  throw new Error(`cannot resolve ${rel} from index.ts`);
}

const documented = new Set(componentDocs.flatMap((d) => d.exports));

describe('registry completeness', () => {
  it('every PascalCase library export has a docs entry or is allow-listed', () => {
    const components = barrelExports().filter((n) => /^[A-Z]/.test(n));
    const missing = components.filter((n) => !documented.has(n) && !ALLOWLIST.has(n));
    expect(missing, `undocumented exports: ${missing.join(', ')}`).toEqual([]);
  });

  it('allow-list has no stale entries', () => {
    const all = new Set(barrelExports());
    const stale = [...ALLOWLIST].filter((n) => !all.has(n) || documented.has(n));
    expect(stale, `remove from ALLOWLIST: ${stale.join(', ')}`).toEqual([]);
  });

  it('doc slugs are unique', () => {
    const slugs = componentDocs.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every related slug resolves to a doc', () => {
    const broken: string[] = [];
    for (const d of componentDocs)
      for (const r of d.related ?? [])
        if (!getComponentDoc(r.slug)) broken.push(`${d.slug} → ${r.slug}`);
    expect(broken).toEqual([]);
  });

  it('every legacy redirect resolves to a template slug / screen / variant', () => {
    const broken: string[] = [];
    for (const [hash, t] of Object.entries(LEGACY_REDIRECTS)) {
      const meta = blockMeta.find((b) => b.slug === t.slug);
      if (!meta) {
        broken.push(`#${hash}: unknown template ${t.slug}`);
        continue;
      }
      if (t.screen && !meta.screens.some((s) => s.key === t.screen))
        broken.push(`#${hash}: unknown screen ${t.slug}/${t.screen}`);
      if (t.variant && !(meta.variants ?? []).some((v) => v.key === t.variant))
        broken.push(`#${hash}: unknown variant ${t.slug}/${t.variant}`);
      if (t.page && !t.variant) broken.push(`#${hash}: page requires a variant`);
    }
    expect(broken).toEqual([]);
  });
});
