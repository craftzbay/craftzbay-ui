import { Check, ChevronDown, Moon, Sun } from '@/icons';
import { IconButton } from '@/components/ui/IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import { BRANDS } from '../site.config';
import { useTheme } from './theme-context';

/** Light/dark toggle — shares the same look in the top bar and the preview chrome. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <IconButton
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      icon={theme === 'light' ? <Moon /> : <Sun />}
      size="sm"
      variant="ghost"
      onClick={toggleTheme}
      className={className}
    />
  );
}

/** Coloured dot used in the brand menu + trigger. A plain CSS colour so it
 *  always reads correctly regardless of the active brand tokens. */
function Swatch({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-block size-3 shrink-0 rounded-full ring-1 ring-inset ring-black/10', className)}
      style={{ backgroundColor: color }}
    />
  );
}

/**
 * On-page brand-code switcher. Re-themes the whole site live (including
 * portalled overlays and any open template-preview tab) by writing the chosen
 * preset's CSS variables to <html>.
 */
export function BrandSwitcher({ compact = false }: { compact?: boolean }) {
  const { brand, setBrand } = useTheme();
  const active = BRANDS.find((b) => b.name === brand) ?? BRANDS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex h-8 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-sm text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground',
          )}
          aria-label={`Brand: ${active.label}`}
        >
          <Swatch color={active.swatch} />
          {!compact && <span className="hidden md:inline">{active.label}</span>}
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Brand preset</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {BRANDS.map((b) => (
          <DropdownMenuItem
            key={b.name}
            onSelect={() => setBrand(b.name)}
            className="flex items-start gap-2.5"
          >
            <Swatch color={b.swatch} className="mt-0.5" />
            <span className="flex min-w-0 flex-col">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                {b.label}
                {b.name === brand && <Check className="size-3.5 text-accent" aria-hidden />}
              </span>
              <span className="text-xs text-foreground-subtle">{b.description}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
