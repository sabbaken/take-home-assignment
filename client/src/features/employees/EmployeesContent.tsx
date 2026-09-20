import { MagnifyingGlass } from '@phosphor-icons/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { Button } from '@/components/ui/button';
import { EmployeesTable } from './EmployeesTable';
import type { EmployeesResponse } from './types';

const COLUMN_WIDTHS = ['w-8', 'w-24', 'w-28', 'w-24', 'w-28', 'w-24'];

interface EmployeesContentProps {
  query: UseQueryResult<EmployeesResponse>;
  /** Only an active filter can be cleared, so only then does the empty state offer it. */
  selectedCount: number;
  onClear: () => void;
}

/**
 * The four states a query can be in, as guard clauses rather than a ternary
 * chain inside the grid. Taking the query itself is what lets `data` be an
 * `EmployeesResponse` below: the two guards narrow it out of `undefined`.
 */
export function EmployeesContent({ query, selectedCount, onClear }: EmployeesContentProps) {
  if (query.isPending) {
    return <TableSkeleton columns={COLUMN_WIDTHS} />;
  }

  if (query.isError) {
    return <ErrorState message="Could not load employees." onRetry={() => void query.refetch()} />;
  }

  const rows = query.data.data;

  if (rows.length === 0) {
    const clearFilters =
      selectedCount > 0 ? (
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear all filters
        </Button>
      ) : null;

    return (
      <EmptyState
        icon={MagnifyingGlass}
        title="Nothing found"
        description="No employee matches the selected filters. Try removing one of them."
        action={clearFilters}
      />
    );
  }

  return <EmployeesTable rows={rows} isStale={query.isFetching} />;
}
