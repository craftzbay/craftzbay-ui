import { useMemo, useState } from 'react';
import { ArrowLeft, Heart, Minus, Plus, Search, ShoppingCart, Star, Trash2, X, ImageIcon } from '@/icons';
import { Badge } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { Card, CardContent } from '@craftzbay/ui';
import { IconButton } from '@craftzbay/ui';
import { Input } from '@craftzbay/ui';
import { Separator } from '@craftzbay/ui';
import { cn } from '@craftzbay/ui';
import type { TemplateProps } from './meta';

/**
 * E-commerce template — storefront grid, product detail, and cart, all sharing
 * a shop header. Fully interactive without a backend: the cart, quantity
 * steppers, wishlist hearts, category filter and search all run on local
 * state.
 */
const CATEGORIES = ['All', 'Audio', 'Wearables', 'Home', 'Accessories'];

const PRODUCTS = [
  { name: 'Aura Wireless Headphones', price: 249, rating: 4.8, tag: 'Audio', hue: 250 },
  { name: 'Pulse Smartwatch', price: 199, rating: 4.6, tag: 'Wearables', hue: 160 },
  { name: 'Lumen Desk Lamp', price: 89, rating: 4.9, tag: 'Home', hue: 65 },
  { name: 'Drift Earbuds', price: 129, rating: 4.5, tag: 'Audio', hue: 290 },
  { name: 'Field Backpack', price: 149, rating: 4.7, tag: 'Accessories', hue: 30 },
  { name: 'Nest Speaker', price: 179, rating: 4.4, tag: 'Audio', hue: 200 },
];

type Cart = Record<string, number>;

const money = (n: number) => `$${n.toFixed(2)}`;

/** Product image placeholder — neutral block that reserves the photo's box. */
/** Image placeholder — a flat, per-category tinted surface (solid colour mixed
 *  into the muted background, so it follows light/dark) with a faint image
 *  glyph. No gradient (PHILOSOPHY). Swap for `<img>` with width/height in a
 *  real feed. */
function Shot({ hue = 250, className }: { hue?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('flex items-center justify-center text-foreground/15', className)}
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
    <span className="inline-flex items-center gap-1 text-xs text-warning-text">
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
    <div className="inline-flex items-center rounded-md border border-border">
      <IconButton
        aria-label="Decrease"
        icon={<Minus />}
        variant="ghost"
        size="sm"
        disabled={qty <= min}
        onClick={() => onChange(qty - 1)}
      />
      <span className="w-8 text-center text-sm tabular">{qty}</span>
      <IconButton aria-label="Increase" icon={<Plus />} variant="ghost" size="sm" onClick={() => onChange(qty + 1)} />
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <div className="text-sm">{brand}</div>
        <nav className="hidden items-center gap-5 text-sm text-foreground-muted md:flex">
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
        <div className="ml-auto flex items-center gap-1">
          {searchable && searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                // eslint-disable-next-line jsx-a11y/no-autofocus -- field is revealed by the user's own "search" click; focusing it is the expected result
                autoFocus
                size="sm"
                placeholder="Search products…"
                value={query}
                onChange={(e) => onQuery?.(e.target.value)}
                className="w-48"
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
            className="relative inline-flex size-9 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted hover:text-foreground"
          >
            <ShoppingCart className="size-4" aria-hidden />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-xs font-medium text-on-accent">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function Shop({
  brand,
  onOpen,
  onCart,
  cartCount,
  category,
  setCategory,
}: {
  brand: React.ReactNode;
  onOpen: () => void;
  onCart: () => void;
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
    <div className="min-h-screen bg-background">
      <ShopHeader
        brand={brand}
        cartCount={cartCount}
        onCart={onCart}
        onCategory={setCategory}
        query={query}
        onQuery={setQuery}
      />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">New arrivals</h1>
            <p className="mt-1 text-sm text-foreground-muted">Thoughtfully made gear for everyday use.</p>
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
          <div className="mt-8 rounded-lg border border-border bg-card p-10 text-center">
            <p className="text-sm font-medium">No products found</p>
            <p className="mt-1 text-sm text-foreground-muted">Nothing matches “{query}” in {category}.</p>
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
                  <button onClick={onOpen} className="block w-full text-left">
                    <Shot hue={p.hue} className="aspect-square w-full" />
                  </button>
                  <button
                    onClick={() => toggleWish(p.name)}
                    aria-label={wishlist.has(p.name) ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                    aria-pressed={wishlist.has(p.name)}
                    className={`absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors ${
                      wishlist.has(p.name) ? 'text-danger-text' : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    <Heart className={`size-3.5 ${wishlist.has(p.name) ? 'fill-current' : ''}`} aria-hidden />
                  </button>
                </div>
                <button onClick={onOpen} className="block w-full p-4 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="neutral" variant="outline">{p.tag}</Badge>
                    <Stars rating={p.rating} />
                  </div>
                  <h3 className="mt-2 text-sm font-medium leading-snug text-foreground group-hover:text-accent">{p.name}</h3>
                  <div className="mt-1 font-semibold tabular text-foreground">{money(p.price)}</div>
                </button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Product({
  brand,
  onCart,
  onBack,
  cartCount,
  addToCart,
  onCategory,
}: {
  brand: React.ReactNode;
  onCart: () => void;
  onBack: () => void;
  cartCount: number;
  addToCart: (name: string, qty: number) => void;
  onCategory: (c: string) => void;
}) {
  const p = PRODUCTS[0];
  const [qty, setQty] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} onCategory={onCategory} />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <button onClick={onBack} className="mb-6 flex w-fit items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground">
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
            <Badge tone="neutral" variant="outline">{p.tag}</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{p.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Stars rating={p.rating} />
              <span className="text-xs text-foreground-subtle">· 214 reviews</span>
            </div>
            <div className="mt-4 text-2xl font-semibold tabular text-foreground">{money(p.price)}</div>
            <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
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
    </div>
  );
}

function CartScreen({
  brand,
  onShop,
  cart,
  setQty,
  remove,
  onCategory,
}: {
  brand: React.ReactNode;
  onShop: () => void;
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
    <div className="min-h-screen bg-background">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={() => {}} onCategory={onCategory} />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        {items.length === 0 ? (
          <div className="mt-6 rounded-lg border border-border bg-card p-12 text-center">
            <ShoppingCart className="mx-auto size-8 text-foreground-subtle" aria-hidden />
            <p className="mt-3 text-sm font-medium">Your cart is empty</p>
            <p className="mt-1 text-sm text-foreground-muted">Browse the shop and add something you like.</p>
            <Button size="sm" className="mt-4" onClick={onShop}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
            <Card padding="none">
              <ul className="divide-y divide-border">
                {items.map((p) => (
                  <li key={p.name} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
                    <Shot hue={p.hue} className="size-16 shrink-0 rounded-md" />
                    <div className="min-w-0 flex-1 basis-32">
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-sm text-foreground-subtle">{money(p.price)}</div>
                    </div>
                    {/* Controls drop to a second, full-width row below sm. */}
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                      <QtyStepper qty={cart[p.name]} onChange={(q) => setQty(p.name, q)} />
                      <div className="ml-auto min-w-16 text-right font-medium tabular text-foreground">
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
    </div>
  );
}

export function EcommerceTemplate({ screen, setScreen, brand }: TemplateProps) {
  const [cart, setCart] = useState<Cart>({
    'Aura Wireless Headphones': 1,
    'Lumen Desk Lamp': 2,
  });
  const [category, setCategory] = useState('All');
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  const addToCart = (name: string, qty: number) => {
    setCart((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + qty }));
    setScreen('cart');
  };
  const setQty = (name: string, qty: number) =>
    setCart((prev) => (qty <= 0 ? removeKey(prev, name) : { ...prev, [name]: qty }));
  const remove = (name: string) => setCart((prev) => removeKey(prev, name));
  const goCategory = (c: string) => {
    setCategory(c);
    setScreen('shop');
  };

  if (screen === 'product')
    return (
      <Product
        brand={brand}
        cartCount={cartCount}
        onBack={() => setScreen('shop')}
        onCart={() => setScreen('cart')}
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
        onShop={() => setScreen('shop')}
        onCategory={goCategory}
      />
    );
  return (
    <Shop
      brand={brand}
      cartCount={cartCount}
      onOpen={() => setScreen('product')}
      onCart={() => setScreen('cart')}
      category={category}
      setCategory={setCategory}
    />
  );
}

function removeKey(cart: Cart, name: string): Cart {
  const { [name]: _removed, ...rest } = cart;
  return rest;
}
