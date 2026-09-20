import { Funnel, X } from '@phosphor-icons/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { FilterGroups } from './FilterGroups';
import type { EmployeeFilters, FilterKey, FilterOptions } from './types';

interface FiltersPanelProps {
  query: UseQueryResult<FilterOptions>;
  filters: EmployeeFilters;
  selectedCount: number;
  onToggle: (key: FilterKey, id: number) => void;
  onClear: () => void;
}

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
