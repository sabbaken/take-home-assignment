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
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse the directory and narrow it down by role, country or department.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
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

          <main className="min-w-0">
            <div className="mb-3 flex h-6 items-center justify-between">
              <p className="text-muted-foreground text-sm" aria-live="polite">
                {employees.isPending
                  ? 'Loading employees…'
                  : employees.isError
                    ? ''
                    : `${total} ${total === 1 ? 'employee' : 'employees'}`}
              </p>
              {employees.isFetching && !employees.isPending ? (
                <span className="text-muted-foreground text-xs">Updating…</span>
              ) : null}
            </div>

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
          </main>
        </div>
      </div>
    </div>
  );
}
