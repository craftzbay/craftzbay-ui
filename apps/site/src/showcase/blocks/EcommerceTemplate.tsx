import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Trash2,
  X,
  ImageIcon,
} from '@/icons';
import { Badge } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { Card, CardContent } from '@craftzbay/ui';
import { EmptyState } from '@craftzbay/ui';
import { IconButton } from '@craftzbay/ui';
import { Input } from '@craftzbay/ui';
import { Separator } from '@craftzbay/ui';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@craftzbay/ui';
import { cn, formatNumber } from '@craftzbay/ui';
import type { TemplateProps } from './meta';
import { readHashParams, writeHash } from './admin/use-hash-params';

/**
 * E-commerce template — storefront grid, product detail, and cart, all sharing
 * a shop header. Fully interactive without a backend: the cart, quantity
 * steppers, wishlist hearts, category filter and search all run on local
 * state.
 */
const CATEGORIES = ['All', 'Audio', 'Wearables', 'Home', 'Accessories'];

const PRODUCTS = [
  { id: 'aura', name: 'Aura Wireless Headphones', price: 249, rating: 4.8, tag: 'Audio', hue: 250 },
  { id: 'pulse', name: 'Pulse Smartwatch', price: 199, rating: 4.6, tag: 'Wearables', hue: 160 },
  { id: 'lumen', name: 'Lumen Desk Lamp', price: 89, rating: 4.9, tag: 'Home', hue: 65 },
  { id: 'drift', name: 'Drift Earbuds', price: 129, rating: 4.5, tag: 'Audio', hue: 290 },
  { id: 'field', name: 'Field Backpack', price: 149, rating: 4.7, tag: 'Accessories', hue: 30 },
  { id: 'nest', name: 'Nest Speaker', price: 179, rating: 4.4, tag: 'Audio', hue: 200 },
];

type Cart = Record<string, number>;

/** USD, EN demo — thousands grouped, always two decimals. */
const money = (n: number) =>
  `$${formatNumber(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type HelpTopic = 'shipping' | 'returns' | 'support';
const HELP: { key: HelpTopic; title: string; body: string }[] = [
  {
    key: 'shipping',
    title: 'Shipping',
    body: 'Orders ship within 1–2 business days. Standard delivery is $9 flat; free over $150. Tracking arrives by email as soon as the parcel leaves the warehouse.',
  },
  {
    key: 'returns',
    title: 'Returns',
    body: 'Return anything within 30 days in its original condition for a full refund. Start a return from your order page — the label is prepaid.',
  },
  {
    key: 'support',
    title: 'Support',
    body: 'We answer within one business day. Include your order number so we can look it up straight away.',
  },
];

/** Product image placeholder — neutral block that reserves the photo's box. */
/** Image placeholder — a flat, per-category tinted surface (solid colour mixed
 *  into the muted background, so it follows light/dark) with a faint image
 *  glyph. No gradient (PHILOSOPHY). Swap for `<img>` with width/height in a
 *  real feed. */
function Shot({ hue = 250, className }: { hue?: number; className?: string }) {
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

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-warning-text inline-flex items-center gap-1 text-xs">
      <Star className="size-3.5 fill-current" aria-hidden />
      <span className="tabular text-foreground-muted">{rating.toFixed(1)}</span>
    </span>
  );
}

function QtyStepper({
  qty,
  onChange,
  min = 1,
}: {
  qty: number;
  onChange: (q: number) => void;
  min?: number;
}) {
  return (
    <div className="border-border inline-flex items-center rounded-md border">
      <IconButton
        aria-label="Decrease"
        icon={<Minus />}
        variant="ghost"
        size="sm"
        disabled={qty <= min}
        onClick={() => onChange(qty - 1)}
      />
      <span className="tabular w-8 text-center text-sm">{qty}</span>
      <IconButton
        aria-label="Increase"
        icon={<Plus />}
        variant="ghost"
        size="sm"
        onClick={() => onChange(qty + 1)}
      />
    </div>
  );
}

function ShopHeader({
  brand,
  cartCount,
  onCart,
  onCategory,
  query,
  onQuery,
}: {
  brand: React.ReactNode;
  cartCount: number;
  onCart: () => void;
  onCategory: (c: string) => void;
  query?: string;
  onQuery?: (q: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchable = Boolean(onQuery);

  return (
    <header className="border-border bg-background sticky top-0 z-[var(--z-sticky)] border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 md:gap-6">
        {/* Categories move into a drawer below md. */}
        <Sheet>
          <SheetTrigger asChild>
            <IconButton
              aria-label="Open menu"
              icon={<Menu />}
              variant="ghost"
              size="sm"
              className="md:hidden"
            />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetTitle>Shop</SheetTitle>
            <nav aria-label="Categories" className="mt-6 flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <SheetClose asChild key={c}>
                  <button
                    type="button"
                    onClick={() => onCategory(c)}
                    className="text-foreground hover:bg-background-muted flex h-11 items-center rounded-md px-3 text-left text-base"
                  >
                    {c}
                  </button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="min-w-0 truncate text-sm">{brand}</div>
        <nav
          aria-label="Categories"
          className="text-foreground-muted hidden items-center gap-5 text-sm md:flex"
        >
          {CATEGORIES.slice(1).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategory(c)}
              className="hover:text-foreground"
            >
              {c}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-1">
          {searchable && searchOpen ? (
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
              <Input
                // eslint-disable-next-line jsx-a11y/no-autofocus -- field is revealed by the user's own "search" click; focusing it is the expected result
                autoFocus
                size="sm"
                label="Search products"
                hideLabel
                placeholder="Search products…"
                value={query}
                onChange={(e) => onQuery?.(e.target.value)}
                className="w-full max-w-xs"
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
              onClick={searchable ? () => setSearchOpen(true) : undefined}
            />
          )}
          <button
            onClick={onCart}
            aria-label="Cart"
            className="text-foreground-muted hover:bg-background-muted hover:text-foreground relative inline-flex size-9 items-center justify-center rounded-md"
          >
            <ShoppingCart className="size-4" aria-hidden />
            {cartCount > 0 && (
              <span className="bg-accent text-on-accent absolute -top-0.5 -right-0.5 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-xs font-medium">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function ShopFooter({ onHelp }: { onHelp: (topic: HelpTopic) => void }) {
  return (
    <footer className="border-border bg-background-subtle mt-auto border-t">
      <div className="text-foreground-subtle mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs sm:px-6">
        <span>© {new Date().getFullYear()} Shop demo. Prices are placeholders.</span>
        <nav aria-label="Help" className="flex gap-4">
          {HELP.map((h) => (
            <button
              key={h.key}
              type="button"
              onClick={() => onHelp(h.key)}
              className="hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {h.title}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/** Help / policies — in-template destination for the footer links. */
function HelpScreen({
  brand,
  topic,
  cartCount,
  onCart,
  onCategory,
  onShop,
  onHelp,
}: {
  brand: React.ReactNode;
  topic: HelpTopic;
  cartCount: number;
  onCart: () => void;
  onCategory: (c: string) => void;
  onShop: () => void;
  onHelp: (topic: HelpTopic) => void;
}) {
  const active = HELP.find((h) => h.key === topic) ?? HELP[0];
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} onCategory={onCategory} />
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <button
          onClick={onShop}
          className="text-foreground-muted hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to shop
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">{active.title}</h1>
        <p className="text-foreground-muted mt-3 max-w-[65ch] text-sm leading-relaxed">
          {active.body}
        </p>
        <Separator className="my-8" />
        <h2 className="text-foreground-subtle text-xs font-semibold tracking-wider uppercase">
          More help
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {HELP.filter((h) => h.key !== active.key).map((h) => (
            <li key={h.key}>
              <button
                type="button"
                onClick={() => onHelp(h.key)}
                className="text-accent font-medium hover:underline"
              >
                {h.title}
              </button>
            </li>
          ))}
        </ul>
      </main>
      <ShopFooter onHelp={onHelp} />
    </div>
  );
}

function Shop({
  brand,
  onOpen,
  onCart,
  onHelp,
  cartCount,
  category,
  setCategory,
}: {
  brand: React.ReactNode;
  onOpen: (id: string) => void;
  onCart: () => void;
  onHelp: (topic: HelpTopic) => void;
  cartCount: number;
  category: string;
  setCategory: (c: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) => (category === 'All' || p.tag === category) && (!q || p.name.toLowerCase().includes(q)),
    );
  }, [category, query]);

  const toggleWish = (name: string) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <ShopHeader
        brand={brand}
        cartCount={cartCount}
        onCart={onCart}
        onCategory={setCategory}
        query={query}
        onQuery={setQuery}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">New arrivals</h1>
            <p className="text-foreground-muted mt-1 text-sm">
              Thoughtfully made gear for everyday use.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                category === c
                  ? 'border-accent bg-accent-soft text-on-accent-soft'
                  : 'border-border text-foreground-muted hover:border-border-strong hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {products.length === 0 ? (
          <div className="border-border bg-card mt-8 rounded-lg border p-10 text-center">
            <p className="text-sm font-medium">No products found</p>
            <p className="text-foreground-muted mt-1 text-sm">
              {query.trim()
                ? `Nothing matches “${query.trim()}” in ${category}.`
                : `Nothing in ${category} right now.`}
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
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {products.map((p) => (
              <Card key={p.name} padding="none" className="group overflow-hidden">
                <div className="relative">
                  <button
                    onClick={() => onOpen(p.id)}
                    aria-label={`View ${p.name}`}
                    className="block w-full text-left"
                  >
                    <Shot hue={p.hue} className="aspect-square w-full" />
                  </button>
                  <button
                    onClick={() => toggleWish(p.name)}
                    aria-label={
                      wishlist.has(p.name)
                        ? `Remove ${p.name} from wishlist`
                        : `Add ${p.name} to wishlist`
                    }
                    aria-pressed={wishlist.has(p.name)}
                    className={`bg-card absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full transition-colors ${
                      wishlist.has(p.name)
                        ? 'text-danger-text'
                        : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    <Heart
                      className={`size-3.5 ${wishlist.has(p.name) ? 'fill-current' : ''}`}
                      aria-hidden
                    />
                  </button>
                </div>
                <button onClick={() => onOpen(p.id)} className="block w-full p-4 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="neutral" variant="outline">
                      {p.tag}
                    </Badge>
                    <Stars rating={p.rating} />
                  </div>
                  <h3 className="text-foreground group-hover:text-accent mt-2 text-sm leading-snug font-medium">
                    {p.name}
                  </h3>
                  <div className="tabular text-foreground mt-1 font-semibold">{money(p.price)}</div>
                </button>
              </Card>
            ))}
          </div>
        )}
      </main>
      <ShopFooter onHelp={onHelp} />
    </div>
  );
}

function Product({
  brand,
  id,
  onCart,
  onBack,
  onHelp,
  cartCount,
  addToCart,
  onCategory,
}: {
  brand: React.ReactNode;
  id: string;
  onCart: () => void;
  onBack: () => void;
  onHelp: (topic: HelpTopic) => void;
  cartCount: number;
  addToCart: (name: string, qty: number) => void;
  onCategory: (c: string) => void;
}) {
  const p = PRODUCTS.find((x) => x.id === id);
  const [qty, setQty] = useState(1);

  if (!p)
    return (
      <div className="bg-background flex min-h-dvh flex-col">
        <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} onCategory={onCategory} />
        <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
          <EmptyState
            icon={<Package />}
            title="Product not found"
            description="It may have sold out or the link is out of date."
            action={
              <Button variant="secondary" leadingIcon={<ArrowLeft />} onClick={onBack}>
                Back to shop
              </Button>
            }
            headingLevel={1}
            className="min-h-[320px]"
          />
        </main>
        <ShopFooter onHelp={onHelp} />
      </div>
    );

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} onCategory={onCategory} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <button
          onClick={onBack}
          className="text-foreground-muted hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to shop
        </button>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Shot hue={p.hue} className="aspect-square w-full rounded-xl" />
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 30, 60, 90].map((d) => (
                <Shot key={d} hue={p.hue + d} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div>
            <Badge tone="neutral" variant="outline">
              {p.tag}
            </Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{p.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Stars rating={p.rating} />
              <span className="text-foreground-subtle text-xs">· 214 reviews</span>
            </div>
            <div className="tabular text-foreground mt-4 text-2xl font-semibold">
              {money(p.price)}
            </div>
            <p className="text-foreground-muted mt-4 text-sm leading-relaxed">
              Reference-grade 40mm drivers, adaptive noise cancellation and a 40-hour battery.
              Machined aluminium, recycled fabric, and a case that finally fits in a pocket.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <QtyStepper qty={qty} onChange={setQty} />
              <Button className="flex-1" onClick={() => addToCart(p.name, qty)}>
                <ShoppingCart className="mr-1 size-4" aria-hidden /> Add to cart
              </Button>
            </div>
            <Separator className="my-6" />
            <dl className="space-y-2 text-sm">
              {[
                ['Battery', '40 hours'],
                ['Weight', '248 g'],
                ['Warranty', '2 years'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-foreground-muted">{k}</dt>
                  <dd className="text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </main>
      <ShopFooter onHelp={onHelp} />
    </div>
  );
}

function CartScreen({
  brand,
  onShop,
  onHelp,
  cart,
  setQty,
  remove,
  onCategory,
}: {
  brand: React.ReactNode;
  onShop: () => void;
  onHelp: (topic: HelpTopic) => void;
  cart: Cart;
  setQty: (name: string, qty: number) => void;
  remove: (name: string) => void;
  onCategory: (c: string) => void;
}) {
  const items = PRODUCTS.filter((p) => cart[p.name]);
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
  const subtotal = items.reduce((s, p) => s + p.price * cart[p.name], 0);
  const shipping = items.length > 0 ? 9 : 0;

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={() => {}} onCategory={onCategory} />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        {items.length === 0 ? (
          <div className="border-border bg-card mt-6 rounded-lg border p-12 text-center">
            <ShoppingCart className="text-foreground-subtle mx-auto size-8" aria-hidden />
            <p className="mt-3 text-sm font-medium">Your cart is empty</p>
            <p className="text-foreground-muted mt-1 text-sm">
              Browse the shop and add something you like.
            </p>
            <Button size="sm" className="mt-4" onClick={onShop}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
            <Card padding="none">
              <ul className="divide-border divide-y">
                {items.map((p) => (
                  <li key={p.name} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
                    <Shot hue={p.hue} className="size-16 shrink-0 rounded-md" />
                    <div className="min-w-0 flex-1 basis-32">
                      <div className="text-foreground font-medium">{p.name}</div>
                      <div className="text-foreground-subtle text-sm">{money(p.price)}</div>
                    </div>
                    {/* Controls drop to a second, full-width row below sm. */}
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                      <QtyStepper qty={cart[p.name]} onChange={(q) => setQty(p.name, q)} />
                      <div className="tabular text-foreground ml-auto min-w-16 text-right font-medium">
                        {money(p.price * cart[p.name])}
                      </div>
                      <IconButton
                        aria-label={`Remove ${p.name}`}
                        icon={<Trash2 />}
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(p.name)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardContent className="space-y-3 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Subtotal</span>
                  <span className="tabular text-foreground">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Shipping</span>
                  <span className="tabular text-foreground">{money(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="tabular">{money(subtotal + shipping)}</span>
                </div>
                <Button className="mt-2 w-full">Checkout</Button>
                <Button variant="ghost" className="w-full" onClick={onShop}>
                  Continue shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <ShopFooter onHelp={onHelp} />
    </div>
  );
}

export function EcommerceTemplate({ screen, setScreen, brand }: TemplateProps) {
  const [cart, setCart] = useState<Cart>({
    'Aura Wireless Headphones': 1,
    'Lumen Desk Lamp': 2,
  });
  const [category, setCategory] = useState('All');
  // Product id lives in the hash tail (`…?id=drift`) so a product page can be
  // reloaded or shared; an unknown id renders the in-template not-found.
  const [productId, setProductId] = useState(() => readHashParams().get('id') ?? PRODUCTS[0].id);
  const [helpTopic, setHelpTopic] = useState<HelpTopic>('shipping');
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
  const openProduct = (id: string) => {
    setProductId(id);
    writeHash({ id });
    setScreen('product');
  };
  const go = (next: string) => {
    writeHash({});
    setScreen(next);
  };
  const openHelp = (topic: HelpTopic) => {
    setHelpTopic(topic);
    go('help');
  };

  const addToCart = (name: string, qty: number) => {
    setCart((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + qty }));
    go('cart');
  };
  const setQty = (name: string, qty: number) =>
    setCart((prev) => (qty <= 0 ? removeKey(prev, name) : { ...prev, [name]: qty }));
  const remove = (name: string) => setCart((prev) => removeKey(prev, name));
  const goCategory = (c: string) => {
    setCategory(c);
    go('shop');
  };

  if (screen === 'product')
    return (
      <Product
        brand={brand}
        id={productId}
        cartCount={cartCount}
        onBack={() => go('shop')}
        onCart={() => go('cart')}
        onHelp={openHelp}
        addToCart={addToCart}
        onCategory={goCategory}
      />
    );
  if (screen === 'cart')
    return (
      <CartScreen
        brand={brand}
        cart={cart}
        setQty={setQty}
        remove={remove}
        onShop={() => go('shop')}
        onHelp={openHelp}
        onCategory={goCategory}
      />
    );
  if (screen === 'help')
    return (
      <HelpScreen
        brand={brand}
        topic={helpTopic}
        cartCount={cartCount}
        onCart={() => go('cart')}
        onCategory={goCategory}
        onShop={() => go('shop')}
        onHelp={openHelp}
      />
    );
  return (
    <Shop
      brand={brand}
      cartCount={cartCount}
      onOpen={openProduct}
      onCart={() => go('cart')}
      onHelp={openHelp}
      category={category}
      setCategory={setCategory}
    />
  );
}

function removeKey(cart: Cart, name: string): Cart {
  const { [name]: _removed, ...rest } = cart;
  return rest;
}
