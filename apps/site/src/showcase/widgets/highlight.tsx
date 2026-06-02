import { Fragment, type ReactNode } from 'react';

/**
 * Tiny dependency-free syntax highlighter for the code panes. Tokenises
 * TS/TSX/JS into comments, strings, numbers and keywords and wraps them in
 * spans coloured from the design tokens (see `.code-block` styles in
 * index.css). Good enough to read like code without pulling in a grammar
 * engine; non-JS languages fall back to plain text.
 */
const KEYWORDS = new Set([
  'import', 'export', 'from', 'default', 'as', 'const', 'let', 'var', 'function',
  'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
  'continue', 'new', 'delete', 'typeof', 'instanceof', 'in', 'of', 'void',
  'class', 'extends', 'implements', 'interface', 'type', 'enum', 'namespace',
  'public', 'private', 'protected', 'readonly', 'static', 'abstract', 'declare',
  'async', 'await', 'yield', 'try', 'catch', 'finally', 'throw', 'this', 'super',
  'null', 'undefined', 'true', 'false', 'satisfies', 'keyof', 'infer',
]);

const HL_LANGS = /^(tsx|ts|typescript|jsx|js|javascript)$/;

export function highlight(code: string, lang = 'tsx'): ReactNode {
  if (!HL_LANGS.test(lang)) return code;

  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const push = (cls: string | null, v: string) => {
    out.push(
      cls ? (
        <span key={key++} className={cls}>
          {v}
        </span>
      ) : (
        <Fragment key={key++}>{v}</Fragment>
      ),
    );
  };

  while (i < code.length) {
    const s = code.slice(i);
    let m: RegExpExecArray | null;

    if ((m = /^\/\/[^\n]*/.exec(s)) || (m = /^\/\*[\s\S]*?\*\//.exec(s))) {
      push('tok-comment', m[0]);
    } else if (
      (m = /^`(?:\\[\s\S]|[^`\\])*`/.exec(s)) ||
      (m = /^"(?:\\.|[^"\\])*"/.exec(s)) ||
      (m = /^'(?:\\.|[^'\\])*'/.exec(s))
    ) {
      push('tok-string', m[0]);
    } else if ((m = /^\d[\w.]*/.exec(s))) {
      push('tok-number', m[0]);
    } else if ((m = /^[A-Za-z_$][\w$]*/.exec(s))) {
      push(KEYWORDS.has(m[0]) ? 'tok-keyword' : null, m[0]);
    } else {
      push(null, code[i]);
      i += 1;
      continue;
    }
    i += m![0].length;
  }
  return out;
}
