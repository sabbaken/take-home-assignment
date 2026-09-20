import { Funnel, X } from '@phosphor-icons/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterGroup } from './FilterGroup';
import { ErrorState } from '@/components/states/ErrorState';
import type { EmployeeFilters, FilterKey, FilterOptions } from './types';

interface FiltersPanelProps {
  query: UseQueryResult<FilterOptions>;
  filters: EmployeeFilters;
  selectedCount: number;
  onToggle: (key: FilterKey, id: number) => void;
  onClear: () => void;
}

const GROUPS: { title: string; filterKey: FilterKey; optionsKey: keyof FilterOptions }[] = [
  { title: 'Role', filterKey: 'roleIds', optionsKey: 'roles' },
  { title: 'Country', filterKey: 'countryIds', optionsKey: 'countries' },
  { title: 'Department', filterKey: 'departmentIds', optionsKey: 'departments' },
];

export function FiltersPanel({
  query,
  filters,
  selectedCount,
  onToggle,
  onClear,
}: FiltersPanelProps) {
  return (
    <aside className="lg:sticky lg:top-22">
      <div className="mb-4 flex h-8 items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Funnel aria-hidden />
          Filters
        </h2>
        {selectedCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={onClear} className="-mr-2 h-8">
            <X aria-hidden />
            Clear all
          </Button>
        ) : null}
      </div>

      <FilterGroups query={query} filters={filters} onToggle={onToggle} />
    </aside>
  );
}

interface FilterGroupsProps {
  query: UseQueryResult<FilterOptions>;
  filters: EmployeeFilters;
  onToggle: (key: FilterKey, id: number) => void;
}

/**
 * The options' three states as guard clauses. There is no empty branch: an
 * empty lookup table is a set of zero checkboxes, which the groups render fine.
 */
function FilterGroups({ query, filters, onToggle }: FilterGroupsProps) {
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

function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      {[4, 5, 4].map((rows, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <Skeleton key={rowIndex} className="h-4 w-32" />
          ))}
        </div>
      ))}
    </div>
  );
}
