import { CollectionDto } from '../../common/collection.dto';

/** Flat row shape returned to the client — no nested relation objects to unwrap. */
export interface EmployeeRowDto {
  id: number;
  firstName: string;
  lastName: string;
  role: string | null;
  country: string | null;
  department: string | null;
}

export type EmployeesResponseDto = CollectionDto<EmployeeRowDto>;
