import { useEmployees } from './use-employees';
import { useEmployeeFilters } from './use-employee-filters';
import { useFilterOptions } from './use-filter-options';
import { EmployeesTable } from './EmployeesTable';
import { FiltersPanel } from './FiltersPanel';
import { ErrorState } from './states/ErrorState';
import { EmptyState } from './states/EmptyState';
import { TableSkeleton } from './states/TableSkeleton';

export function EmployeesPage() {
  const { filters, toggle, clear, selectedCount } = useEmployeeFilters();
  const options = useFilterOptions();
  const employees = useEmployees(filters);

  const rows = employees.data?.data ?? [];
  const total = employees.data?.total ?? 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 flex h-8 flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Employees</h1>
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {employees.isPending
            ? 'Loading…'
            : employees.isError
              ? ''
              : `${total} ${total === 1 ? 'person' : 'people'}`}
        </p>
        {employees.isFetching && !employees.isPending ? (
          <span className="text-muted-foreground text-xs">Updating…</span>
        ) : null}
      </div>

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
            <TableSkeleton />
          ) : employees.isError ? (
            <ErrorState
              message="Could not load employees."
              onRetry={() => void employees.refetch()}
            />
          ) : rows.length === 0 ? (
            <EmptyState onClear={selectedCount > 0 ? clear : undefined} />
          ) : (
            <EmployeesTable rows={rows} isStale={employees.isFetching} />
          )}
        </div>
      </div>
    </main>
  );
}
