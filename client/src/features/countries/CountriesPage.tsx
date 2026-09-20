import type { UseQueryResult } from '@tanstack/react-query';
import { PageHeader, type RowCount } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { CountriesTable } from './CountriesTable';
import type { Country } from './types';
import { useCountries } from './use-countries';

const COLUMN_WIDTHS = ['w-8', 'w-40'];

/** The `countries` lookup table. No filters here — the point is to see what the employees table filters by. */
export function CountriesPage() {
  const countries = useCountries();

  const count: RowCount = countries.isPending
    ? 'loading'
    : countries.isError
      ? null
      : countries.data.length;

  return (
    <>
      <PageHeader title="Countries" noun={['country', 'countries']} count={count} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <CountriesContent query={countries} />
      </main>
    </>
  );
}

/**
 * The four states a query can be in, as guard clauses rather than a ternary
 * chain inside `<main>`. Taking the query itself is what lets `data` be a
 * `Country[]` below: the two guards narrow it out of `undefined`.
 */
function CountriesContent({ query }: { query: UseQueryResult<Country[]> }) {
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
