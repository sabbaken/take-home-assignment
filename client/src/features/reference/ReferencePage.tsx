import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { ReferenceTable } from './ReferenceTable';
import { REFERENCE_RESOURCES, type ReferenceResource } from './resources';
import { useReference } from './use-reference';

const COLUMN_WIDTHS = ['w-8', 'w-40'];

/**
 * One screen for all three lookup tables: they are the same two columns, so the
 * resource is a prop rather than three near-identical copies of this file. No
 * filters here on purpose — the point is to see what the employees table can
 * filter by.
 */
export function ReferencePage({ resource }: { resource: ReferenceResource }) {
  const { title, noun } = REFERENCE_RESOURCES[resource];
  const reference = useReference(resource);

  const rows = reference.data ?? [];

  return (
    <>
      <PageHeader
        title={title}
        noun={noun}
        count={reference.isPending ? 'loading' : reference.isError ? null : rows.length}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {reference.isPending ? (
          <TableSkeleton columns={COLUMN_WIDTHS} />
        ) : reference.isError ? (
          <ErrorState
            message={`Could not load ${title.toLowerCase()}.`}
            onRetry={() => void reference.refetch()}
          />
        ) : rows.length === 0 ? (
          <EmptyState
            title={`No ${title.toLowerCase()} yet`}
            description="This table is empty — seed the database or add a row through the API."
          />
        ) : (
          <ReferenceTable rows={rows} />
        )}
      </main>
    </>
  );
}
