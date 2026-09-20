import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

/** How many rows a page lists: `'loading'` during the first fetch, `null` when it failed. */
export type RowCount = number | 'loading' | null;

interface PageHeaderProps {
  title: string;
  /** [singular, plural] for the count — "1 person", "12 people". */
  noun: readonly [string, string];
  count: RowCount;
  /** True while a refetch replaces rows that are already on screen. */
  isFetching?: boolean;
}

/**
 * The bar above every screen. Navigation lives in the sidebar, so this only
 * says where you are and how much is here — each page renders it with its own
 * numbers instead of the layout guessing them from the route.
 */
export function PageHeader({ title, noun, count, isFetching = false }: PageHeaderProps) {
  // A refetch during the first load is already covered by "Loading…".
  const isRefreshing = isFetching && count !== 'loading';

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="-ml-1.5" />
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />

      <h1 className="text-sm font-semibold tracking-tight">{title}</h1>

      <p className="text-muted-foreground text-sm" aria-live="polite">
        {formatCount(count, noun)}
      </p>

      {isRefreshing ? <span className="text-muted-foreground text-xs">Updating…</span> : null}
    </header>
  );
}

/** A failed fetch says nothing here — the page itself is already showing the error. */
function formatCount(count: RowCount, noun: readonly [string, string]): string {
  if (count === 'loading') {
    return 'Loading…';
  }

  if (count === null) {
    return '';
  }

  return `${count} ${count === 1 ? noun[0] : noun[1]}`;
}
