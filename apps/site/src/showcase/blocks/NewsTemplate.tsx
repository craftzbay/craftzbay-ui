import { ArrowLeft, Menu, Search } from '@/icons';
import { Avatar } from '@craftzbay/ui';
import { Badge } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { IconButton } from '@craftzbay/ui';
import { Separator } from '@craftzbay/ui';
import type { TemplateProps } from './meta';

/**
 * News / magazine template — a publication front page (masthead + category
 * nav, lead story, latest grid, trending sidebar) and a full article reader.
 */
const CATEGORIES = ['World', 'Business', 'Technology', 'Science', 'Culture', 'Sport'];

const ARTICLES = [
  { cat: 'Technology', title: 'The quiet design system revolution reshaping the web', excerpt: 'How token-driven UI libraries are collapsing the gap between design and code.', author: 'A. Bold', initials: 'AB', time: '2h ago', hue: 250 },
  { cat: 'Business', title: 'Markets steady as central banks signal a pause', excerpt: 'Investors weigh softer inflation against a cooling labour market.', author: 'B. Erdene', initials: 'BE', time: '4h ago', hue: 150 },
  { cat: 'Science', title: 'Deep-sea survey finds dozens of unknown species', excerpt: 'A months-long expedition mapped ridges no instrument had reached before.', author: 'T. Ganbat', initials: 'TG', time: '6h ago', hue: 200 },
  { cat: 'Culture', title: 'The slow return of the long-form essay', excerpt: 'Readers are paying for depth again — and writers are noticing.', author: 'S. Khan', initials: 'SK', time: '9h ago', hue: 320 },
];

function Cover({ hue, className }: { hue: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        background: `linear-gradient(135deg, oklch(0.7 0.12 ${hue}), oklch(0.45 0.14 ${hue + 40}))`,
      }}
    />
  );
}

function Masthead({ brand }: { brand: React.ReactNode }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
        <IconButton aria-label="Menu" icon={<Menu />} variant="ghost" size="sm" className="md:hidden" />
        <div className="text-lg font-semibold tracking-tight">{brand}</div>
        <div className="ml-auto flex items-center gap-2">
          <IconButton aria-label="Search" icon={<Search />} variant="ghost" size="sm" />
          <Button size="sm">Subscribe</Button>
        </div>
      </div>
      <nav className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center gap-5 overflow-x-auto px-6 py-2.5 text-sm">
          {CATEGORIES.map((c, i) => (
            <a
              key={c}
              href="#"
              onClick={(e) => e.preventDefault()}
              className={i === 0 ? 'font-medium text-accent' : 'text-foreground-muted hover:text-foreground'}
            >
              {c}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function Byline({ initials, author, time }: { initials: string; author: string; time: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-foreground-subtle">
      <Avatar size="xs" fallback={initials} />
      <span className="text-foreground-muted">{author}</span>
      <span aria-hidden>·</span>
      <span>{time}</span>
    </div>
  );
}

function FrontPage({ brand, onOpen }: { brand: React.ReactNode; onOpen: () => void }) {
  const [lead, ...rest] = ARTICLES;
  return (
    <div className="min-h-screen bg-background">
      <Masthead brand={brand} />
      <main className="mx-auto grid max-w-5xl gap-10 px-6 py-10 lg:grid-cols-[1fr_18rem]">
        <div>
          {/* Lead story */}
          <button onClick={onOpen} className="group block w-full text-left">
            <Cover hue={lead.hue} className="aspect-[16/8] w-full rounded-lg" />
            <div className="mt-4">
              <Badge tone="accent" variant="outline">{lead.cat}</Badge>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight group-hover:text-accent">
                {lead.title}
              </h1>
              <p className="mt-2 text-base leading-relaxed text-foreground-muted">{lead.excerpt}</p>
              <div className="mt-3">
                <Byline {...lead} />
              </div>
            </div>
          </button>

          <Separator className="my-8" />

          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground-subtle">Latest</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((a) => (
              <button key={a.title} onClick={onOpen} className="group text-left">
                <Cover hue={a.hue} className="aspect-[16/9] w-full rounded-md" />
                <Badge tone="neutral" variant="outline" className="mt-3">{a.cat}</Badge>
                <h3 className="mt-2 font-semibold leading-snug text-foreground group-hover:text-accent">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{a.excerpt}</p>
                <div className="mt-2">
                  <Byline {...a} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trending sidebar */}
        <aside className="lg:border-l lg:border-border lg:pl-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground-subtle">Trending</h2>
          <ol className="space-y-5">
            {ARTICLES.map((a, i) => (
              <li key={a.title}>
                <button onClick={onOpen} className="group flex gap-3 text-left">
                  <span className="text-xl font-semibold tabular text-border-strong">{i + 1}</span>
                  <span className="text-sm font-medium leading-snug text-foreground group-hover:text-accent">
                    {a.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">The Daily Brief</h3>
            <p className="mt-1 text-sm text-foreground-muted">Top stories in your inbox each morning.</p>
            <Button size="sm" className="mt-3 w-full">Sign up free</Button>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Article({ brand, onBack }: { brand: React.ReactNode; onBack: () => void }) {
  const a = ARTICLES[0];
  return (
    <div className="min-h-screen bg-background">
      <Masthead brand={brand} />
      <article className="mx-auto max-w-2xl px-6 py-10">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back to front page
        </button>
        <Badge tone="accent" variant="outline">{a.cat}</Badge>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">{a.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground-muted">{a.excerpt}</p>
        <div className="mt-5 flex items-center justify-between">
          <Byline {...a} />
          <span className="text-xs text-foreground-subtle">6 min read</span>
        </div>
        <Cover hue={a.hue} className="mt-6 aspect-[16/9] w-full rounded-lg" />
        <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground">
          <p>
            For years the boundary between design and engineering was a stack of hand-offs. A new
            generation of token-driven libraries is quietly erasing it — and teams are shipping
            measurably faster as a result.
          </p>
          <p>
            The shift is subtle. Instead of pixel specs, designers ship semantic tokens; instead of
            re-implementing them, engineers consume the same source of truth. Themes become data,
            and dark mode stops being a project.
          </p>
          <p>
            “We stopped arguing about spacing,” one lead told us. “The system decides, and we get
            our afternoons back.” That sentiment — less debate, more shipping — came up again and
            again across the dozen teams we spoke to.
          </p>
        </div>
      </article>
    </div>
  );
}

export function NewsTemplate({ screen, setScreen, brand }: TemplateProps) {
  if (screen === 'article') return <Article brand={brand} onBack={() => setScreen('home')} />;
  return <FrontPage brand={brand} onOpen={() => setScreen('article')} />;
}
