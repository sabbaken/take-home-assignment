import { MagnifyingGlass } from '@phosphor-icons/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { PageHeader, type RowCount } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { Button } from '@/components/ui/button';
import { useEmployees } from './use-employees';
import { useEmployeeFilters } from './use-employee-filters';
import { useFilterOptions } from './use-filter-options';
import { EmployeesTable } from './EmployeesTable';
import { FiltersPanel } from './FiltersPanel';
import type { EmployeesResponse } from './types';

const COLUMN_WIDTHS = ['w-8', 'w-24', 'w-28', 'w-24', 'w-28', 'w-24'];

export function EmployeesPage() {
  const { filters, toggle, clear, selectedCount } = useEmployeeFilters();
  const options = useFilterOptions();
  const employees = useEmployees(filters);

  const count: RowCount = employees.isPending
    ? 'loading'
    : employees.isError
      ? null
      : employees.data.total;

  return (
    <>
      <PageHeader
        title="Employees"
        noun={['person', 'people']}
        count={count}
        isFetching={employees.isFetching}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
          <FiltersPanel
            query={options}
            filters={filters}
            selectedCount={selectedCount}
            onToggle={toggle}
            onClear={clear}
          />

          <div className="min-w-0">
            <EmployeesContent query={employees} selectedCount={selectedCount} onClear={clear} />
          </div>
        </div>
      </main>
    </>
  );
}

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
function EmployeesContent({ query, selectedCount, onClear }: EmployeesContentProps) {
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
