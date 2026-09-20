import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchEmployees } from './api';
import type { EmployeeFilters } from './types';

export function useEmployees(filters: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: ({ signal }) => fetchEmployees(filters, signal),
    // Keeps the previous rows on screen while a new filter combination loads,
    // so toggling a checkbox doesn't flash the table back to a skeleton.
    placeholderData: keepPreviousData,
  });
}
