import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/** A PATCH body: the one field is optional, and an absent key changes nothing. */
export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;
}
