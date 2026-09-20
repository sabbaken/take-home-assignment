import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface PageHeaderProps {
  title: string;
  /** [singular, plural] for the count — "1 person", "12 people". */
  noun: readonly [string, string];
  /** How many rows the page lists: `'loading'` during the first fetch, `null` when it failed. */
  count: number | 'loading' | null;
  /** True while a refetch replaces rows that are already on screen. */
  isFetching?: boolean;
}

/**
 * The bar above every screen. Navigation lives in the sidebar, so this only
 * says where you are and how much is here — each page renders it with its own
 * numbers instead of the layout guessing them from the route.
 */
export function PageHeader({ title, noun, count, isFetching = false }: PageHeaderProps) {
  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="-ml-1.5" />
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />

      <h1 className="text-sm font-semibold tracking-tight">{title}</h1>

      <p className="text-muted-foreground text-sm" aria-live="polite">
        {count === 'loading'
          ? 'Loading…'
          : count === null
            ? ''
            : `${count} ${count === 1 ? noun[0] : noun[1]}`}
      </p>

      {isFetching && count !== 'loading' ? (
        <span className="text-muted-foreground text-xs">Updating…</span>
      ) : null}
    </header>
  );
}
