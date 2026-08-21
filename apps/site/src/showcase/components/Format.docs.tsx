import { formatDate, formatMNT, formatNumber, formatPhone } from '@/lib/format';
import type { ComponentDoc } from '../registry/types';

const SAMPLE_DATE = new Date('2026-08-20T02:05:00Z');

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <code className="text-foreground-muted text-xs">{label}</code>
      <span className="tabular text-sm">{value}</span>
    </>
  );
}

const grid = 'grid w-full max-w-lg grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2';

const doc: ComponentDoc = {
  slug: 'format',
  name: 'Format helpers',
  group: 'Utilities',
  description:
    'Dependency-free, locale-fixed formatters. Defaults target Mongolia (Asia/Ulaanbaatar, `₮` suffix, `,` thousands) and produce identical output on server and client — no Intl locale surprises during hydration.',
  exports: ['formatDate', 'formatNumber', 'formatMNT', 'formatPhone'],
  sourceFile: '../../lib/format.ts',
  examples: [
    {
      title: 'formatDate',
      description:
        'Fixed time zone (default Asia/Ulaanbaatar) + a small token pattern: `yyyy MM dd HH mm ss` and unpadded `M d H`. Invalid input returns an empty string.',
      preview: (
        <div className={grid}>
          <Row label="formatDate(d)" value={formatDate(SAMPLE_DATE)} />
          <Row
            label="formatDate(d, { pattern: 'dd.MM.yyyy' })"
            value={formatDate(SAMPLE_DATE, { pattern: 'dd.MM.yyyy' })}
          />
          <Row
            label="formatDate(d, { tz: 'UTC', pattern: 'HH:mm' })"
            value={formatDate(SAMPLE_DATE, { tz: 'UTC', pattern: 'HH:mm' })}
          />
        </div>
      ),
      code: `const d = new Date('2026-08-20T02:05:00Z');

formatDate(d);                                   // "2026-08-20 10:05"
formatDate(d, { pattern: 'dd.MM.yyyy' });        // "20.08.2026"
formatDate(d, { tz: 'UTC', pattern: 'HH:mm' }); // "02:05"`,
    },
    {
      title: 'formatNumber',
      description:
        'Thousands grouping with explicit separators. Trailing zeros are trimmed unless `minimumFractionDigits` asks for them; `-0` never appears.',
      preview: (
        <div className={grid}>
          <Row label="formatNumber(1250000)" value={formatNumber(1250000)} />
          <Row label="formatNumber(1234.5)" value={formatNumber(1234.5)} />
          <Row
            label="formatNumber(12, { minimumFractionDigits: 2 })"
            value={formatNumber(12, { minimumFractionDigits: 2 })}
          />
          <Row
            label="formatNumber(9999.99, { group: ' ', decimal: ',' })"
            value={formatNumber(9999.99, { group: ' ', decimal: ',' })}
          />
        </div>
      ),
      code: `formatNumber(1250000);                              // "1,250,000"
formatNumber(1234.5);                               // "1,234.5"
formatNumber(12, { minimumFractionDigits: 2 });     // "12.00"
formatNumber(9999.99, { group: ' ', decimal: ',' }); // "9 999,99"`,
    },
    {
      title: 'formatMNT',
      description:
        'Tögrög: grouped integer + `₮` suffix, no space. `compact` abbreviates ≥1,000 as K / M / B with one decimal — for KPI tiles and chart ticks, never for invoices.',
      preview: (
        <div className={grid}>
          <Row label="formatMNT(1250000)" value={formatMNT(1250000)} />
          <Row
            label="formatMNT(12400000, { compact: true })"
            value={formatMNT(12400000, { compact: true })}
          />
          <Row
            label="formatMNT(850000, { compact: true })"
            value={formatMNT(850000, { compact: true })}
          />
        </div>
      ),
      code: `formatMNT(1250000);                    // "1,250,000₮"
formatMNT(12400000, { compact: true }); // "12.4M₮"
formatMNT(850000, { compact: true });   // "850K₮"`,
    },
    {
      title: 'formatPhone',
      description:
        'Display form for Mongolian numbers — accepts 8 digits with or without `+976` / `976` and spacing. Anything else is returned unchanged, so it is safe to run over mixed data.',
      preview: (
        <div className={grid}>
          <Row label="formatPhone('99112233')" value={formatPhone('99112233')} />
          <Row label="formatPhone('+97699112233')" value={formatPhone('+97699112233')} />
          <Row label="formatPhone('+1 555 0100')" value={formatPhone('+1 555 0100')} />
        </div>
      ),
      code: `formatPhone('99112233');     // "+976 9911 2233"
formatPhone('+97699112233'); // "+976 9911 2233"
formatPhone('+1 555 0100');  // "+1 555 0100" (non-MN, untouched)`,
    },
  ],
  api: [
    {
      title: 'formatDate(date, options?)',
      rows: [
        {
          name: 'date',
          type: 'Date | number | string',
          required: true,
          description: 'Anything `new Date()` accepts.',
        },
        { name: 'tz', type: 'string', default: "'Asia/Ulaanbaatar'", description: 'IANA zone.' },
        {
          name: 'pattern',
          type: 'string',
          default: "'yyyy-MM-dd HH:mm'",
          description: 'Tokens: yyyy MM dd HH mm ss, plus unpadded M d H.',
        },
      ],
    },
    {
      title: 'formatNumber(n, options?)',
      rows: [
        { name: 'maximumFractionDigits', type: 'number', default: '2', description: '' },
        { name: 'minimumFractionDigits', type: 'number', default: '0', description: '' },
        { name: 'group', type: 'string', default: "','", description: 'Thousands separator.' },
        { name: 'decimal', type: 'string', default: "'.'", description: 'Decimal separator.' },
      ],
    },
    {
      title: 'formatMNT(n, options?)',
      rows: [
        {
          name: 'compact',
          type: 'boolean',
          default: 'false',
          description: 'Abbreviate ≥1,000 as K / M / B with one decimal.',
        },
        {
          name: '…FormatNumberOptions',
          type: "Omit<FormatNumberOptions, 'maximumFractionDigits'>",
          description: 'Separators; fraction digits are fixed to 0 (or 1 when compact).',
        },
      ],
    },
    {
      title: 'formatPhone(input)',
      rows: [
        {
          name: 'input',
          type: 'string',
          required: true,
          description: 'Raw phone string. Returned unchanged when not an 8-digit MN number.',
        },
      ],
    },
  ],
  guidelines: {
    do: [
      'Pair numeric output with the `tabular` utility (or `align="right"` in Table) so digits line up.',
      'Store phone numbers in E.164 (`parsePhoneMN`) and format only for display.',
    ],
    dont: [
      'Use `toLocaleString()` for the same value on server and client — the locale can differ and cause hydration mismatches.',
      'Show compact money where the exact amount matters (billing, invoices, exports).',
    ],
  },
  related: [
    { slug: 'relative-time', reason: '"5 min ago" with the absolute date as tooltip.' },
    { slug: 'table', reason: 'Right-aligned tabular numeric columns.' },
  ],
};

export default doc;
