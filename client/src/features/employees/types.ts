/**
 * Mirror of the server's API contract. Kept as a local copy rather than a shared
 * workspace package: a `packages/shared` would need its own build/resolve setup
 * in both Vite and Nest for ~15 lines of types. See README → Trade-offs.
 */

export interface EmployeeRow {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  country: string | null;
  department: string | null;
}

export interface EmployeesResponse {
  data: EmployeeRow[];
  total: number;
}

export interface FilterOption {
  id: number;
  name: string;
}

export interface FilterOptions {
  countries: FilterOption[];
  departments: FilterOption[];
  roles: FilterOption[];
}

/** The three filter dimensions, keyed exactly as the API query parameters. */
export interface EmployeeFilters {
  roleIds: number[];
  countryIds: number[];
  departmentIds: number[];
}

export type FilterKey = keyof EmployeeFilters;
