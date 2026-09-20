/** Flat row shape returned to the client — no nested relation objects to unwrap. */
export interface EmployeeRowDto {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  country: string | null;
  department: string | null;
}

export interface EmployeesResponseDto {
  data: EmployeeRowDto[];
  total: number;
}
