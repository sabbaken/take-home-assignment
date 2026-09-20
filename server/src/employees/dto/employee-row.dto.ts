/** Flat row shape returned to the client — no nested relation objects to unwrap. */
export interface EmployeeRowDto {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  country: string | null;
  department: string | null;
}

/**
 * The table endpoint answers with a count beside the rows: the page prints it
 * ("40 employees"), and a bare array would leave nowhere to put a page size or
 * a cursor later. The reference tables are short option lists and return plain
 * arrays.
 */
export interface EmployeesResponseDto {
  data: EmployeeRowDto[];
  total: number;
}
