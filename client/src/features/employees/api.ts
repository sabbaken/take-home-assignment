import type { EmployeeFilters, EmployeesResponse, FilterOptions } from './types';

/** Requests go to the same origin; Vite proxies /api to the Nest server in dev. */
const API_BASE = '/api';

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

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
