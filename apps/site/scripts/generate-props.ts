/**
 * Parse every component under src/components/ui/ with react-docgen-typescript
 * and emit src/showcase/registry/generated-props.ts — a typed map of
 * `{ [componentName]: PropGroup[] }`. Doc files import from there instead of
 * hand-writing the props arrays, so the docs can never drift from the
 * TypeScript interface.
 *
 * Run via `pnpm gen:props`. CI also runs it before build.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import ts from 'typescript';
import { withCustomConfig } from 'react-docgen-typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..'); // apps/site
const UI_PKG = path.resolve(ROOT, '../../packages/ui'); // packages/ui
const UI_DIR = path.join(UI_PKG, 'src/components/ui');
const OUTPUT = path.join(ROOT, 'src/showcase/registry/generated-props.ts');
const TSCONFIG = path.join(UI_PKG, 'tsconfig.json');

const parser = withCustomConfig(TSCONFIG, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Skip props inherited from native HTML attributes — too much noise.
  propFilter: (prop) => {
    if (prop.parent) {
      const fn = prop.parent.fileName;
      if (fn.includes('node_modules/@types/react')) return false;
      if (fn.includes('node_modules/react')) return false;
      // TypeScript's lib files: Function/Number/Object prototype members that
      // leak in when a parameter type widens; their Symbol-keyed entries carry
      // an unstable `__@name@id` that flaked the freshness check (see below).
      if (/node_modules\/typescript\/lib\//.test(fn)) return false;
    }
    return !prop.description?.startsWith('@internal');
  },
});

interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropGroup {
  title?: string;
  rows: PropRow[];
}

/**
 * Components react-docgen gets wrong or misses, re-extracted straight from
 * the props type with the TypeScript checker. `own` keeps only members
 * declared in the component file (drops inherited Radix / HTML props);
 * `keep` is an explicit allowlist of prop names.
 */
const TYPE_OVERRIDES: Record<
  string,
  { file: string; type: string; own?: boolean; keep?: string[] }
> = {
  // docgen attributes the Select *root* (Radix) props to SelectTrigger.
  SelectTrigger: { file: 'Select.tsx', type: 'SelectTriggerProps', own: true },
  // DayPicker's props are generic; docgen emits nothing. Keep the common surface.
  Calendar: {
    file: 'Calendar.tsx',
    type: 'CalendarProps',
    keep: [
      'mode',
      'selected',
      'onSelect',
      'defaultMonth',
      'month',
      'onMonthChange',
      'captionLayout',
      'numberOfMonths',
      'disabled',
      'showOutsideDays',
      'weekStartsOn',
      'locale',
      'className',
    ],
  },
  Sidebar: { file: 'Sidebar.tsx', type: 'SidebarProps', own: true },
};

/** Components whose docgen output is trimmed to the props the docs describe. */
const ROW_ALLOWLIST: Record<string, string[]> = {
  // Raw Vaul root props are noise — keep the ones consumers actually set.
  Drawer: [
    'open',
    'defaultOpen',
    'onOpenChange',
    'direction',
    'dismissible',
    'modal',
    'shouldScaleBackground',
    'snapPoints',
  ],
};

let program: ts.Program | undefined;
function getProgram(): ts.Program {
  if (program) return program;
  const cfg = ts.readConfigFile(TSCONFIG, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, UI_PKG);
  const roots = Object.values(TYPE_OVERRIDES).map((o) => path.join(UI_DIR, o.file));
  program = ts.createProgram(roots, parsed.options);
  return program;
}

function jsDocText(sym: ts.Symbol, checker: ts.TypeChecker): { description: string; def?: string } {
  const description = ts
    .displayPartsToString(sym.getDocumentationComment(checker))
    .replace(/\s+/g, ' ')
    .trim();
  const def = sym
    .getJsDocTags(checker)
    .find((t) => t.name === 'default')
    ?.text?.map((t) => t.text)
    .join('')
    .trim();
  return { description, def };
}

function propsFromType(name: string): PropGroup[] | undefined {
  const o = TYPE_OVERRIDES[name];
  const file = path.join(UI_DIR, o.file);
  const prog = getProgram();
  const checker = prog.getTypeChecker();
  const sf = prog.getSourceFile(file);
  if (!sf) return undefined;
  let decl: ts.Node | undefined;
  sf.forEachChild((n) => {
    if ((ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) && n.name.text === o.type)
      decl = n;
  });
  if (!decl) return undefined;
  const type = checker.getTypeAtLocation(decl);
  const rows: PropRow[] = [];
  for (const sym of checker.getPropertiesOfType(type)) {
    const d = sym.declarations?.[0];
    if (!d) continue;
    // Members declared in TypeScript's own lib files (Number/Function/Object
    // prototype: toFixed, apply, valueOf, Symbol.hasInstance…) are not props —
    // they surface when a prop type widens to a primitive or callable, and
    // the Symbol-keyed ones carry an unstable `__@name@id` that changed with
    // every type-graph edit and flaked the generated-props freshness check.
    if (d.getSourceFile().hasNoDefaultLib) continue;
    if (o.own && d.getSourceFile().fileName !== sf.fileName) continue;
    if (o.keep && !o.keep.includes(sym.name)) continue;
    const { description, def } = jsDocText(sym, checker);
    if (description.startsWith('@internal')) continue;
    const required = !(sym.flags & ts.SymbolFlags.Optional);
    // Prefer the source text of the annotation (`ReactNode`, `Matcher[]`) —
    // checker.typeToString expands aliases and embeds absolute import paths,
    // which would make the output machine-dependent.
    let typeText: string;
    if (ts.isPropertySignature(d) && d.type) {
      typeText = d.type.getText(d.getSourceFile());
    } else {
      const propType = checker.getTypeOfSymbolAtLocation(sym, d);
      typeText = checker.typeToString(
        checker.getNonNullableType(propType),
        d,
        ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
      );
    }
    typeText = typeText
      .replace(/\s+/g, ' ')
      .replace(/^undefined \| /, '')
      .replace(/ \| undefined$/, '');
    rows.push({
      name: sym.name,
      type: simplifyType(typeText),
      default: def,
      required,
      description,
    });
  }
  if (rows.length === 0) return undefined;
  rows.sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return [{ rows }];
}

function parseFile(file: string): Record<string, PropGroup[]> {
  const components = parser.parse(file);
  if (components.length === 0) return {};
  const out: Record<string, PropGroup[]> = {};
  for (const c of components) {
    const rows: PropRow[] = Object.values(c.props).map((p) => ({
      name: p.name,
      type: simplifyType(p.type?.name ?? 'unknown'),
      default: p.defaultValue?.value ?? undefined,
      required: p.required,
      description: (p.description ?? '').replace(/\s+/g, ' ').trim(),
    }));
    if (rows.length === 0) continue;
    // Sort: required first, then alphabetical.
    rows.sort((a, b) => {
      if (a.required !== b.required) return a.required ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    out[c.displayName] = [{ rows }];
  }
  return out;
}

function simplifyType(type: string): string {
  // react-docgen often spits out very long unions for ReactNode / CSSProperties.
  // Tighten the common cases so the table stays readable.
  return type
    .replace(/ReactElement<.*?, .*?>/g, 'ReactElement')
    .replace(/false \| /g, '')
    .slice(0, 240);
}

function main() {
  const files = fs
    .readdirSync(UI_DIR)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
    .map((f) => path.join(UI_DIR, f));

  const all: Record<string, PropGroup[]> = {};
  for (const file of files) {
    try {
      const parsed = parseFile(file);
      Object.assign(all, parsed);
    } catch (err) {
      console.warn(`[gen-props] skipping ${path.basename(file)}: ${(err as Error).message}`);
    }
  }

  for (const [name, keep] of Object.entries(ROW_ALLOWLIST)) {
    const groups = all[name];
    if (!groups) continue;
    all[name] = groups.map((g) => ({ ...g, rows: g.rows.filter((r) => keep.includes(r.name)) }));
  }
  for (const name of Object.keys(TYPE_OVERRIDES)) {
    const groups = propsFromType(name);
    if (groups) all[name] = groups;
    else console.warn(`[gen-props] override for ${name} produced no rows`);
  }

  const sortedNames = Object.keys(all).sort();
  const json = JSON.stringify(Object.fromEntries(sortedNames.map((n) => [n, all[n]])), null, 2);

  const banner = `// AUTO-GENERATED by scripts/generate-props.ts — do not edit by hand.
// Run \`pnpm gen:props\` to refresh after changing a component's interface.
//
// Sourced from the exported props interfaces of each component under
// src/components/ui/. Native HTML attributes inherited via Omit<HTMLAttrs>
// are filtered out — only library-specific props are listed.

import type { PropGroup } from './types';

export const generatedProps: Record<string, PropGroup[]> = ${json};

/**
 * Lookup helper: returns auto-generated props for a component, or undefined
 * if the parser couldn't extract any (consumer should hand-write \`api\` then).
 */
export function getGeneratedProps(name: string): PropGroup[] | undefined {
  return generatedProps[name];
}
`;

  fs.writeFileSync(OUTPUT, banner);
  console.log(
    `[gen-props] wrote ${sortedNames.length} components → ${path.relative(ROOT, OUTPUT)}`,
  );
}

main();
