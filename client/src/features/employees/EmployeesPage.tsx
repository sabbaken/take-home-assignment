import { PageHeader, type RowCount } from '@/components/layout/PageHeader';
import { EmployeesContent } from './EmployeesContent';
import { FiltersPanel } from './filters/FiltersPanel';
import { useEmployeeFilters } from './filters/use-employee-filters';
import { useFilterOptions } from './filters/use-filter-options';
import { useEmployees } from './use-employees';

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
