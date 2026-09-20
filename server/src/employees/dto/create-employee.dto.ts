import { applyDecorators } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

/**
 * All three foreign keys are nullable in the given schema, so every one of them
 * is optional on the way in. `@IsOptional` also lets an explicit `null` through,
 * which is how a client clears a relation on PATCH.
 */
export const IsOptionalForeignKey = () => applyDecorators(IsOptional(), IsInt(), Min(1));

const IsName = () => applyDecorators(IsString(), IsNotEmpty(), MaxLength(255));

export class CreateEmployeeDto {
  @IsName()
  firstName!: string;

  @IsName()
  lastName!: string;

  @IsOptionalForeignKey()
  roleId?: number | null;

  @IsOptionalForeignKey()
  countryId?: number | null;

  @IsOptionalForeignKey()
  departmentId?: number | null;
}
