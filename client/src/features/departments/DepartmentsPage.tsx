import { PageHeader, type RowCount } from '@/components/layout/PageHeader';
import { DepartmentsContent } from './DepartmentsContent';
import { useDepartments } from './use-departments';

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
