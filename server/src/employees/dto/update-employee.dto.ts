import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsOptionalForeignKey } from './create-employee.dto';

/**
 * A PATCH body: every field optional, and only the fields actually sent are
 * written. Spelled out rather than derived from `CreateEmployeeDto` — the
 * required/optional split is the whole difference between the two.
 */
export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName?: string;

  @IsOptionalForeignKey()
  roleId?: number | null;

  @IsOptionalForeignKey()
  countryId?: number | null;

  @IsOptionalForeignKey()
  departmentId?: number | null;
}
