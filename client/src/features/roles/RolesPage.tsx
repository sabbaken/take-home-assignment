import type { UseQueryResult } from '@tanstack/react-query';
import { PageHeader, type RowCount } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { RolesTable } from './RolesTable';
import type { Role } from './types';
import { useRoles } from './use-roles';

const COLUMN_WIDTHS = ['w-8', 'w-40'];

/** The `roles` lookup table. No filters here — the point is to see what the employees table filters by. */
export function RolesPage() {
  const roles = useRoles();

  const count: RowCount = roles.isPending ? 'loading' : roles.isError ? null : roles.data.length;

  return (
    <>
      <PageHeader title="Roles" noun={['role', 'roles']} count={count} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <RolesContent query={roles} />
      </main>
    </>
  );
}

/**
 * The four states a query can be in, as guard clauses rather than a ternary
 * chain inside `<main>`. Taking the query itself is what lets `data` be a
 * `Role[]` below: the two guards narrow it out of `undefined`.
 */
function RolesContent({ query }: { query: UseQueryResult<Role[]> }) {
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
