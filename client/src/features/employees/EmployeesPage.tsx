import { MagnifyingGlass } from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/states/EmptyState';
import { ErrorState } from '@/components/states/ErrorState';
import { TableSkeleton } from '@/components/states/TableSkeleton';
import { Button } from '@/components/ui/button';
import { useEmployees } from './use-employees';
import { useEmployeeFilters } from './use-employee-filters';
import { useFilterOptions } from './use-filter-options';
import { EmployeesTable } from './EmployeesTable';
import { FiltersPanel } from './FiltersPanel';

const COLUMN_WIDTHS = ['w-8', 'w-24', 'w-28', 'w-24', 'w-28', 'w-24'];

export function EmployeesPage() {
  const { filters, toggle, clear, selectedCount } = useEmployeeFilters();
  const options = useFilterOptions();
  const employees = useEmployees(filters);

  const rows = employees.data?.data ?? [];
  const total = employees.data?.total ?? 0;

  return (
    <>
      <PageHeader
        title="Employees"
        noun={['person', 'people']}
        count={employees.isPending ? 'loading' : employees.isError ? null : total}
        isFetching={employees.isFetching}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
          <FiltersPanel
            options={options.data}
            isLoading={options.isPending}
            isError={options.isError}
            onRetry={() => void options.refetch()}
            filters={filters}
            selectedCount={selectedCount}
            onToggle={toggle}
            onClear={clear}
          />

          <div className="min-w-0">
            {employees.isPending ? (
              <TableSkeleton columns={COLUMN_WIDTHS} />
            ) : employees.isError ? (
              <ErrorState
                message="Could not load employees."
                onRetry={() => void employees.refetch()}
              />
            ) : rows.length === 0 ? (
              <EmptyState
                icon={MagnifyingGlass}
                title="Nothing found"
                description="No employee matches the selected filters. Try removing one of them."
                action={
                  selectedCount > 0 ? (
                    <Button variant="outline" size="sm" onClick={clear}>
                      Clear all filters
                    </Button>
                  ) : null
                }
              />
            ) : (
              <EmployeesTable rows={rows} isStale={employees.isFetching} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
