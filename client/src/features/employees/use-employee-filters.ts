import { useCallback, useMemo, useState } from 'react';
import type { EmployeeFilters, FilterKey } from './types';

const EMPTY_FILTERS: EmployeeFilters = {
  roleIds: [],
  countryIds: [],
  departmentIds: [],
};

export function useEmployeeFilters() {
  const [filters, setFilters] = useState<EmployeeFilters>(EMPTY_FILTERS);

  const toggle = useCallback((key: FilterKey, id: number) => {
    setFilters((current) => {
      const selected = current[key];
      const next = selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id];

      return { ...current, [key]: next };
    });
  }, []);

  const clear = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const selectedCount = useMemo(
    () => Object.values(filters).reduce((total, ids) => total + ids.length, 0),
    [filters],
  );

  return { filters, toggle, clear, selectedCount };
}
