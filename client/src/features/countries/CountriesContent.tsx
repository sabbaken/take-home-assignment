import type { UseQueryResult } from '@tanstack/react-query';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { CountriesTable } from './CountriesTable';
import type { Country } from './types';

const COLUMN_WIDTHS = ['w-8', 'w-40'];

/**
 * The four states a query can be in, as guard clauses rather than a ternary
 * chain inside the page's `<main>`. Taking the query itself is what lets `data`
 * be a `Country[]` below: the two guards narrow it out of `undefined`.
 */
export function CountriesContent({ query }: { query: UseQueryResult<Country[]> }) {
  if (query.isPending) {
    return <TableSkeleton columns={COLUMN_WIDTHS} />;
  }

  if (query.isError) {
    return <ErrorState message="Could not load countries." onRetry={() => void query.refetch()} />;
  }

  if (query.data.length === 0) {
    return (
      <EmptyState
        title="No countries yet"
        description="This table is empty — seed the database or add a row through the API."
      />
    );
  }

  return <CountriesTable rows={query.data} />;
}
