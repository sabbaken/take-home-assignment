import type { UseQueryResult } from '@tanstack/react-query';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { RolesTable } from './RolesTable';
import type { Role } from './types';

const COLUMN_WIDTHS = ['w-8', 'w-40'];

/**
 * The four states a query can be in, as guard clauses rather than a ternary
 * chain inside the page's `<main>`. Taking the query itself is what lets `data`
 * be a `Role[]` below: the two guards narrow it out of `undefined`.
 */
export function RolesContent({ query }: { query: UseQueryResult<Role[]> }) {
  if (query.isPending) {
    return <TableSkeleton columns={COLUMN_WIDTHS} />;
  }

  if (query.isError) {
    return <ErrorState message="Could not load roles." onRetry={() => void query.refetch()} />;
  }

  if (query.data.length === 0) {
    return (
      <EmptyState
        title="No roles yet"
        description="This table is empty — seed the database or add a row through the API."
      />
    );
  }

  return <RolesTable rows={query.data} />;
}
