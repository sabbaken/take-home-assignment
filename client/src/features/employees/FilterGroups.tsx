import type { UseQueryResult } from '@tanstack/react-query';
import { ErrorState } from '@/components/states/ErrorState';
import { FilterGroup } from './FilterGroup';
import { FiltersSkeleton } from './FiltersSkeleton';
import type { EmployeeFilters, FilterKey, FilterOptions } from './types';

interface FilterGroupsProps {
  query: UseQueryResult<FilterOptions>;
  filters: EmployeeFilters;
  onToggle: (key: FilterKey, id: number) => void;
}

const GROUPS: { title: string; filterKey: FilterKey; optionsKey: keyof FilterOptions }[] = [
  { title: 'Role', filterKey: 'roleIds', optionsKey: 'roles' },
  { title: 'Country', filterKey: 'countryIds', optionsKey: 'countries' },
  { title: 'Department', filterKey: 'departmentIds', optionsKey: 'departments' },
];

/**
 * The options' three states as guard clauses. There is no empty branch: an
 * empty lookup table is a set of zero checkboxes, which the groups render fine.
 */
export function FilterGroups({ query, filters, onToggle }: FilterGroupsProps) {
  if (query.isError) {
    return (
      <ErrorState message="Could not load filter options." onRetry={() => void query.refetch()} />
    );
  }

  if (query.isPending) {
    return <FiltersSkeleton />;
  }

  return (
    <div className="divide-y">
      {GROUPS.map((group) => (
        <div key={group.filterKey} className="py-5 first:pt-0 last:pb-0">
          <FilterGroup
            title={group.title}
            filterKey={group.filterKey}
            options={query.data[group.optionsKey]}
            selectedIds={filters[group.filterKey]}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  );
}
