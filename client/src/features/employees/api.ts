import { getJson } from '@/lib/api';
import type { EmployeeFilters, EmployeesResponse, FilterOptions } from './types';

function buildEmployeesQuery(filters: EmployeeFilters): string {
  const params = new URLSearchParams();

  // Empty groups are omitted entirely — the server reads that as "no filter".
  for (const [key, ids] of Object.entries(filters)) {
    if (ids.length > 0) {
      params.set(key, ids.join(','));
    }
  }

  const query = params.toString();

  return query ? `?${query}` : '';
}

export function fetchEmployees(
  filters: EmployeeFilters,
  signal?: AbortSignal,
): Promise<EmployeesResponse> {
  return getJson<EmployeesResponse>(`/employees${buildEmployeesQuery(filters)}`, signal);
}

export function fetchFilterOptions(signal?: AbortSignal): Promise<FilterOptions> {
  return getJson<FilterOptions>('/filters', signal);
}
