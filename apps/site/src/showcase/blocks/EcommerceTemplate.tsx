import { ArrowLeft, Heart, Minus, Plus, Search, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { Badge } from '@craftzbay/ui';
import { Button } from '@craftzbay/ui';
import { Card, CardContent } from '@craftzbay/ui';
import { IconButton } from '@craftzbay/ui';
import { Separator } from '@craftzbay/ui';
import type { TemplateProps } from './meta';

/**
 * E-commerce template — storefront grid, product detail, and cart, all sharing
 * a shop header. Screens switch from the preview dock; clicking a product or
 * "Add to cart" moves between them too.
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

const money = (n: number) => `$${n.toFixed(2)}`;

function Shot({ hue, className }: { hue: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ background: `linear-gradient(140deg, oklch(0.92 0.05 ${hue}), oklch(0.78 0.1 ${hue + 30}))` }}
    />
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

function ShopHeader({ brand, cartCount, onCart }: { brand: React.ReactNode; cartCount: number; onCart: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <div className="text-sm">{brand}</div>
        <nav className="hidden items-center gap-5 text-sm text-foreground-muted md:flex">
          {CATEGORIES.slice(1).map((c) => (
            <a key={c} href="#" className="hover:text-foreground">{c}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <IconButton aria-label="Search" icon={<Search />} variant="ghost" size="sm" />
          <button
            onClick={onCart}
            aria-label="Cart"
            className="relative inline-flex size-9 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted hover:text-foreground"
          >
            <ShoppingCart className="size-4" aria-hidden />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-on-accent">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function Shop({ brand, onOpen, onCart, cartCount }: { brand: React.ReactNode; onOpen: () => void; onCart: () => void; cartCount: number }) {
  return (
    <div className="min-h-screen bg-background">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">New arrivals</h1>
            <p className="mt-1 text-sm text-foreground-muted">Thoughtfully made gear for everyday use.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c, i) => (
            <button
              key={c}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                i === 0
                  ? 'border-accent bg-accent-soft text-on-accent-soft'
                  : 'border-border text-foreground-muted hover:border-border-strong hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <Card key={p.name} padding="none" className="group overflow-hidden">
              <button onClick={onOpen} className="block w-full text-left">
                <div className="relative">
                  <Shot hue={p.hue} className="aspect-square w-full" />
                  <span className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-background/80 text-foreground-muted backdrop-blur">
                    <Heart className="size-3.5" aria-hidden />
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="neutral" variant="outline">{p.tag}</Badge>
                    <Stars rating={p.rating} />
                  </div>
                  <h3 className="mt-2 text-sm font-medium leading-snug text-foreground group-hover:text-accent">{p.name}</h3>
                  <div className="mt-1 font-semibold tabular text-foreground">{money(p.price)}</div>
                </div>
              </button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function Product({ brand, onCart, onBack, cartCount, addToCart }: { brand: React.ReactNode; onCart: () => void; onBack: () => void; cartCount: number; addToCart: () => void }) {
  const p = PRODUCTS[0];
  return (
    <div className="min-h-screen bg-background">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={onCart} />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground">
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
              <div className="inline-flex items-center rounded-md border border-border">
                <IconButton aria-label="Decrease" icon={<Minus />} variant="ghost" size="sm" />
                <span className="w-8 text-center text-sm tabular">1</span>
                <IconButton aria-label="Increase" icon={<Plus />} variant="ghost" size="sm" />
              </div>
              <Button className="flex-1" onClick={addToCart}>
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

const CART_ITEMS = [
  { name: 'Aura Wireless Headphones', price: 249, qty: 1, hue: 250 },
  { name: 'Lumen Desk Lamp', price: 89, qty: 2, hue: 65 },
];

function Cart({ brand, onShop, cartCount }: { brand: React.ReactNode; onShop: () => void; cartCount: number }) {
  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 9;
  return (
    <div className="min-h-screen bg-background">
      <ShopHeader brand={brand} cartCount={cartCount} onCart={() => {}} />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <Card padding="none">
            <ul className="divide-y divide-border">
              {CART_ITEMS.map((it) => (
                <li key={it.name} className="flex items-center gap-4 p-4">
                  <Shot hue={it.hue} className="size-16 shrink-0 rounded-md" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">{it.name}</div>
                    <div className="text-sm text-foreground-subtle">{money(it.price)}</div>
                  </div>
                  <div className="inline-flex items-center rounded-md border border-border">
                    <IconButton aria-label="Decrease" icon={<Minus />} variant="ghost" size="sm" />
                    <span className="w-8 text-center text-sm tabular">{it.qty}</span>
                    <IconButton aria-label="Increase" icon={<Plus />} variant="ghost" size="sm" />
                  </div>
                  <div className="w-20 text-right font-medium tabular text-foreground">{money(it.price * it.qty)}</div>
                  <IconButton aria-label="Remove" icon={<Trash2 />} variant="ghost" size="sm" />
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
      </main>
    </div>
  );
}

export function EcommerceTemplate({ screen, setScreen, brand }: TemplateProps) {
  const cartCount = 2;
  if (screen === 'product')
    return (
      <Product
        brand={brand}
        cartCount={cartCount}
        onBack={() => setScreen('shop')}
        onCart={() => setScreen('cart')}
        addToCart={() => setScreen('cart')}
      />
    );
  if (screen === 'cart') return <Cart brand={brand} cartCount={cartCount} onShop={() => setScreen('shop')} />;
  return <Shop brand={brand} cartCount={cartCount} onOpen={() => setScreen('product')} onCart={() => setScreen('cart')} />;
}
