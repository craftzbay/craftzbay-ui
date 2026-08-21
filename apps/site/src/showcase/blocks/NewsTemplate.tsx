import { useMemo, useState } from 'react';
import { ArrowLeft, FileText, Menu, Search, X, ImageIcon } from '@/icons';
import { Avatar } from '@craftzbay/ui';
import { Badge } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { EmptyState } from '@craftzbay/ui';
import { IconButton } from '@craftzbay/ui';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@craftzbay/ui';
import { Input } from '@craftzbay/ui';
import { Separator } from '@craftzbay/ui';
import { cn } from '@craftzbay/ui';
import type { TemplateProps } from './meta';
import { readHashParams, writeHash } from './admin/use-hash-params';

/**
 * News / magazine template — a publication front page (masthead + category
 * nav, lead story, latest grid, trending sidebar) and a full article reader.
 * Fully interactive without a backend: category nav and search filter the
 * mock article list client-side.
 */
const CATEGORIES = ['All', 'World', 'Business', 'Technology', 'Science', 'Culture', 'Sport'];

const ARTICLES = [
  {
    id: 'design-systems',
    cat: 'Technology',
    title: 'The quiet design system revolution reshaping the web',
    excerpt: 'How token-driven UI libraries are collapsing the gap between design and code.',
    author: 'A. Bold',
    initials: 'AB',
    time: '2h ago',
    hue: 250,
  },
  {
    id: 'markets-pause',
    cat: 'Business',
    title: 'Markets steady as central banks signal a pause',
    excerpt: 'Investors weigh softer inflation against a cooling labour market.',
    author: 'B. Erdene',
    initials: 'BE',
    time: '4h ago',
    hue: 150,
  },
  {
    id: 'deep-sea-survey',
    cat: 'Science',
    title: 'Deep-sea survey finds dozens of unknown species',
    excerpt: 'A months-long expedition mapped ridges no instrument had reached before.',
    author: 'T. Ganbat',
    initials: 'TG',
    time: '6h ago',
    hue: 200,
  },
  {
    id: 'long-form-essay',
    cat: 'Culture',
    title: 'The slow return of the long-form essay',
    excerpt: 'Readers are paying for depth again — and writers are noticing.',
    author: 'S. Khan',
    initials: 'SK',
    time: '9h ago',
    hue: 320,
  },
];

type Article = (typeof ARTICLES)[number];

type LegalTopic = 'privacy' | 'terms' | 'contact';
const LEGAL: { key: LegalTopic; title: string; body: string }[] = [
  {
    key: 'privacy',
    title: 'Privacy',
    body: 'We collect only what the newsletter needs — your email address — and never sell it. Unsubscribe from any issue in one click.',
  },
  {
    key: 'terms',
    title: 'Terms',
    body: 'Articles are free to read and link to. Republishing full text requires written permission; excerpts with attribution are welcome.',
  },
  {
    key: 'contact',
    title: 'Contact',
    body: 'Tips, corrections and press enquiries reach the newsroom desk within one business day.',
  },
];

/** Image placeholder — a flat, per-category tinted surface (solid colour mixed
 *  into the muted background, so it follows light/dark) with a faint image
 *  glyph. No gradient (PHILOSOPHY). Swap for `<img>` with width/height in a
 *  real feed. */
function Cover({ hue = 250, className }: { hue?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('text-foreground/15 flex items-center justify-center', className)}
      style={{
        background: `color-mix(in oklch, var(--background-muted) 78%, oklch(0.62 0.14 ${hue}))`,
      }}
    >
      <ImageIcon className="size-8" strokeWidth={1.25} />
    </div>
  );
}

function Masthead({
  brand,
  active,
  onCategory,
  query,
  onQuery,
}: {
  brand: React.ReactNode;
  active?: string;
  onCategory?: (c: string) => void;
  query?: string;
  onQuery?: (q: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const interactive = Boolean(onCategory);

  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <IconButton
              aria-label="Menu"
              icon={<Menu />}
              variant="ghost"
              size="sm"
              className="md:hidden"
            />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle>Sections</SheetTitle>
            <nav className="mt-6 flex flex-col gap-1" aria-label="Sections">
              {CATEGORIES.map((c) => (
                <SheetClose asChild key={c}>
                  <button
                    type="button"
                    onClick={() => onCategory?.(c)}
                    aria-current={active === c ? 'page' : undefined}
                    className={cn(
                      'flex h-11 items-center rounded-md px-3 text-left text-base',
                      active === c
                        ? 'bg-accent-soft text-accent font-medium'
                        : 'text-foreground hover:bg-background-muted',
                    )}
                  >
                    {c}
                  </button>
                </SheetClose>
              ))}
              <Button className="mt-4 w-full sm:hidden">Subscribe</Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="min-w-0 truncate text-lg font-semibold tracking-tight">{brand}</div>
        <div className="ml-auto flex items-center gap-2">
          {interactive && searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                // eslint-disable-next-line jsx-a11y/no-autofocus -- field is revealed by the user's own "search" click; focusing it is the expected result
                autoFocus
                size="sm"
                label="Search stories"
                hideLabel
                placeholder="Search stories…"
                value={query}
                onChange={(e) => onQuery?.(e.target.value)}
                className="w-full max-w-56"
              />
              <IconButton
                aria-label="Close search"
                icon={<X />}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onQuery?.('');
                  setSearchOpen(false);
                }}
              />
            </div>
          ) : (
            <IconButton
              aria-label="Search"
              icon={<Search />}
              variant="ghost"
              size="sm"
              onClick={interactive ? () => setSearchOpen(true) : undefined}
            />
          )}
          <Button size="sm" className="hidden sm:inline-flex">
            Subscribe
          </Button>
        </div>
      </div>
      <nav aria-label="Sections" className="border-border border-t">
        <div className="mx-auto flex max-w-5xl snap-x [scrollbar-width:none] items-center gap-5 overflow-x-auto px-6 py-2.5 text-sm [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategory?.(c)}
              aria-current={active === c ? 'page' : undefined}
              className={cn(
                'shrink-0 snap-start py-1 whitespace-nowrap',
                active === c
                  ? 'text-accent font-medium'
                  : 'text-foreground-muted hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

function Footer({
  brand,
  onSection,
  onLegal,
}: {
  brand: React.ReactNode;
  onSection: (c: string) => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const linkClass =
    'text-foreground-muted hover:text-foreground rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  return (
    <footer className="border-border bg-background-subtle border-t">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 sm:grid-cols-3">
        <div>
          <div className="text-base font-semibold tracking-tight">{brand}</div>
          <p className="text-foreground-muted mt-2 max-w-xs text-sm leading-relaxed">
            Independent reporting on technology, business, science and culture — every day.
          </p>
        </div>
        <nav aria-label="Footer sections">
          <h2 className="text-foreground-subtle text-xs font-semibold tracking-wider uppercase">
            Sections
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.filter((c) => c !== 'All').map((c) => (
              <li key={c}>
                <button type="button" onClick={() => onSection(c)} className={linkClass}>
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-foreground-subtle text-xs font-semibold tracking-wider uppercase">
            The Daily Brief
          </h2>
          <p className="text-foreground-muted mt-3 text-sm">
            Top stories in your inbox each morning.
          </p>
          <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input
              size="sm"
              type="email"
              label="Email address"
              hideLabel
              autoComplete="email"
              placeholder="you@example.com"
              className="min-w-0 flex-1 basis-40"
            />
            <Button size="sm" variant="secondary" type="submit">
              Sign up
            </Button>
          </form>
        </div>
      </div>
      <div className="border-border border-t">
        <div className="text-foreground-subtle mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs">
          <span>
            © {new Date().getFullYear()} {brand}. All rights reserved.
          </span>
          <nav aria-label="Legal" className="flex gap-4">
            {LEGAL.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => onLegal(l.key)}
                className="hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {l.title}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

/** Legal / contact — in-template destination for the footer links. */
function LegalPage({
  brand,
  topic,
  onBack,
  onSection,
  onLegal,
}: {
  brand: React.ReactNode;
  topic: LegalTopic;
  onBack: () => void;
  onSection: (c: string) => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const active = LEGAL.find((l) => l.key === topic) ?? LEGAL[0];
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <Masthead brand={brand} onCategory={onSection} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <button
          onClick={onBack}
          className="text-foreground-muted hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to front page
        </button>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight">{active.title}</h1>
        <p className="text-foreground-muted mt-4 max-w-[65ch] text-base leading-relaxed">
          {active.body}
        </p>
      </main>
      <Footer brand={brand} onSection={onSection} onLegal={onLegal} />
    </div>
  );
}

function Byline({ initials, author, time }: { initials: string; author: string; time: string }) {
  return (
    <div className="text-foreground-subtle flex items-center gap-2 text-xs">
      <Avatar size="xs" fallback={initials} />
      <span className="text-foreground-muted">{author}</span>
      <span aria-hidden>·</span>
      <span>{time}</span>
    </div>
  );
}

function FrontPage({
  brand,
  category,
  setCategory,
  onOpen,
  onLegal,
}: {
  brand: React.ReactNode;
  category: string;
  setCategory: (c: string) => void;
  onOpen: (a: Article) => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter(
      (a) =>
        (category === 'All' || a.cat === category) &&
        (!q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)),
    );
  }, [category, query]);

  const [lead, ...rest] = filtered;

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <Masthead
        brand={brand}
        active={category}
        onCategory={setCategory}
        query={query}
        onQuery={setQuery}
      />
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_18rem]">
        <div>
          {!lead ? (
            <div className="border-border bg-card rounded-lg border p-10 text-center">
              <h1 className="text-sm font-medium">No stories found</h1>
              <p className="text-foreground-muted mt-1 text-sm">
                {query.trim()
                  ? `Nothing matches “${query.trim()}” in ${category === 'All' ? 'any section' : category}.`
                  : `Nothing in ${category} yet.`}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              {/* Lead story */}
              <button onClick={() => onOpen(lead)} className="group block w-full text-left">
                <Cover hue={lead.hue} className="aspect-[16/8] w-full rounded-lg" />
                <div className="mt-4">
                  <Badge tone="accent" variant="outline">
                    {lead.cat}
                  </Badge>
                  <h1 className="group-hover:text-accent mt-3 text-3xl leading-tight font-semibold tracking-tight">
                    {lead.title}
                  </h1>
                  <p className="text-foreground-muted mt-2 text-base leading-relaxed">
                    {lead.excerpt}
                  </p>
                  <div className="mt-3">
                    <Byline {...lead} />
                  </div>
                </div>
              </button>

              {rest.length > 0 && (
                <>
                  <Separator className="my-8" />
                  <h2 className="text-foreground-subtle mb-4 text-xs font-semibold tracking-wider uppercase">
                    Latest
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {rest.map((a) => (
                      <button key={a.id} onClick={() => onOpen(a)} className="group text-left">
                        <Cover hue={a.hue} className="aspect-[16/9] w-full rounded-md" />
                        <Badge tone="neutral" variant="outline" className="mt-3">
                          {a.cat}
                        </Badge>
                        <h3 className="text-foreground group-hover:text-accent mt-2 leading-snug font-semibold">
                          {a.title}
                        </h3>
                        <p className="text-foreground-muted mt-1 text-sm leading-relaxed">
                          {a.excerpt}
                        </p>
                        <div className="mt-2">
                          <Byline {...a} />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Trending sidebar */}
        <aside className="lg:border-border lg:border-l lg:pl-8">
          <h2 className="text-foreground-subtle mb-4 text-xs font-semibold tracking-wider uppercase">
            Trending
          </h2>
          <ol className="space-y-5">
            {ARTICLES.map((a, i) => (
              <li key={a.id}>
                <button onClick={() => onOpen(a)} className="group flex gap-3 text-left">
                  <span className="tabular text-border-strong text-xl font-semibold">{i + 1}</span>
                  <span className="text-foreground group-hover:text-accent text-sm leading-snug font-medium">
                    {a.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="border-border bg-card mt-8 rounded-lg border p-4 md:p-6">
            <h3 className="text-sm font-semibold">The Daily Brief</h3>
            <p className="text-foreground-muted mt-1 text-sm">
              Top stories in your inbox each morning.
            </p>
            <Button size="sm" variant="secondary" className="mt-3 w-full">
              Sign up free
            </Button>
          </div>
        </aside>
      </main>
      <Footer brand={brand} onSection={setCategory} onLegal={onLegal} />
    </div>
  );
}

function ArticlePage({
  brand,
  id,
  onBack,
  onSection,
  onLegal,
}: {
  brand: React.ReactNode;
  id: string;
  onBack: () => void;
  onSection: (c: string) => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const a = ARTICLES.find((x) => x.id === id);
  if (!a)
    return (
      <div className="bg-background flex min-h-dvh flex-col">
        <Masthead brand={brand} onCategory={onSection} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
          <EmptyState
            icon={<FileText />}
            title="Story not found"
            description="It may have been unpublished or the link is out of date."
            action={
              <Button variant="secondary" leadingIcon={<ArrowLeft />} onClick={onBack}>
                Back to front page
              </Button>
            }
            headingLevel={1}
            className="min-h-[320px]"
          />
        </main>
        <Footer brand={brand} onSection={onSection} onLegal={onLegal} />
      </div>
    );
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <Masthead brand={brand} onCategory={onSection} />
      <article className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        {/* `flex w-fit` (not inline-flex): an inline-level button shares the
            line with the inline Badge below, gluing "Back to front page" to
            the category chip. */}
        <button
          onClick={onBack}
          className="text-foreground-muted hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to front page
        </button>
        <Badge tone="accent" variant="outline">
          {a.cat}
        </Badge>
        <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-tight">{a.title}</h1>
        <p className="text-foreground-muted mt-4 text-lg leading-relaxed">{a.excerpt}</p>
        <div className="mt-5 flex items-center justify-between">
          <Byline {...a} />
          <span className="text-foreground-subtle text-xs">6 min read</span>
        </div>
        <Cover hue={a.hue} className="mt-6 aspect-[16/9] w-full rounded-lg" />
        <div className="text-foreground mt-8 max-w-[65ch] space-y-4 text-base leading-relaxed">
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
      <Footer brand={brand} onSection={onSection} onLegal={onLegal} />
    </div>
  );
}

export function NewsTemplate({ screen, setScreen, brand }: TemplateProps) {
  const [category, setCategory] = useState('All');
  // Article id lives in the hash tail (`…?id=markets-pause`) so a story can be
  // reloaded or shared; an unknown id renders the in-template not-found.
  const [articleId, setArticleId] = useState(() => readHashParams().get('id') ?? ARTICLES[0].id);
  const [legalTopic, setLegalTopic] = useState<LegalTopic>('privacy');
  const go = (next: string) => {
    writeHash({});
    setScreen(next);
  };
  const openArticle = (a: Article) => {
    setArticleId(a.id);
    writeHash({ id: a.id });
    setScreen('article');
  };
  const openSection = (c: string) => {
    setCategory(c);
    go('home');
  };
  const openLegal = (t: LegalTopic) => {
    setLegalTopic(t);
    go('legal');
  };
  if (screen === 'article')
    return (
      <ArticlePage
        brand={brand}
        id={articleId}
        onBack={() => go('home')}
        onSection={openSection}
        onLegal={openLegal}
      />
    );
  if (screen === 'legal')
    return (
      <LegalPage
        brand={brand}
        topic={legalTopic}
        onBack={() => go('home')}
        onSection={openSection}
        onLegal={openLegal}
      />
    );
  return (
    <FrontPage
      brand={brand}
      category={category}
      setCategory={setCategory}
      onOpen={openArticle}
      onLegal={openLegal}
    />
  );
}
