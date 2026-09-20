import type { UseQueryResult } from '@tanstack/react-query';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { DepartmentsTable } from './DepartmentsTable';
import type { Department } from './types';

const COLUMN_WIDTHS = ['w-8', 'w-40'];

/**
 * The four states a query can be in, as guard clauses rather than a ternary
 * chain inside the page's `<main>`. Taking the query itself is what lets `data`
 * be a `Department[]` below: the two guards narrow it out of `undefined`.
 */
export function DepartmentsContent({ query }: { query: UseQueryResult<Department[]> }) {
  if (query.isPending) {
    return <TableSkeleton columns={COLUMN_WIDTHS} />;
  }

  if (query.isError) {
    return (
      <ErrorState message="Could not load departments." onRetry={() => void query.refetch()} />
    );
  }

  if (query.data.length === 0) {
    return (
      <EmptyState
        title="No departments yet"
        description="This table is empty — seed the database or add a row through the API."
      />
    );
  }

  return <DepartmentsTable rows={query.data} />;
}
