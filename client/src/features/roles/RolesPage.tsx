import { PageHeader, type RowCount } from '@/components/layout/PageHeader';
import { RolesContent } from './RolesContent';
import { useRoles } from './use-roles';

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
