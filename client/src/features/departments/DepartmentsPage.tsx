import type { UseQueryResult } from '@tanstack/react-query';
import { PageHeader, type RowCount } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { DepartmentsTable } from './DepartmentsTable';
import type { Department } from './types';
import { useDepartments } from './use-departments';

const COLUMN_WIDTHS = ['w-8', 'w-40'];

/** The `departments` lookup table. No filters here — the point is to see what the employees table filters by. */
export function DepartmentsPage() {
  const departments = useDepartments();

  const count: RowCount = departments.isPending
    ? 'loading'
    : departments.isError
      ? null
      : departments.data.length;

  return (
    <>
      <PageHeader title="Departments" noun={['department', 'departments']} count={count} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <DepartmentsContent query={departments} />
      </main>
    </>
  );
}

/**
 * The four states a query can be in, as guard clauses rather than a ternary
 * chain inside `<main>`. Taking the query itself is what lets `data` be a
 * `Department[]` below: the two guards narrow it out of `undefined`.
 */
function DepartmentsContent({ query }: { query: UseQueryResult<Department[]> }) {
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
