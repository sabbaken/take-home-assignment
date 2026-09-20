import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsInt, IsOptional, Min } from 'class-validator';

/**
 * Multi-value filters arrive as a comma-separated list: `?roleIds=1,2`.
 * An absent or empty parameter means "do not filter by this dimension".
 */
const toIntArray = ({ value }: { value: unknown }): unknown => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const raw = Array.isArray(value) ? value : String(value).split(',');

  return (
    raw
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0)
      // Non-numeric entries are passed through untouched so that @IsInt rejects them.
      .map((item) => (/^\d+$/.test(item) ? Number(item) : item))
  );
};

const IdListParam = () =>
  applyDecorators(
    IsOptional(),
    Transform(toIntArray),
    IsArray(),
    ArrayUnique(),
    IsInt({ each: true }),
    Min(1, { each: true }),
  );

export class FindEmployeesQueryDto {
  @IdListParam()
  roleIds?: number[];

  @IdListParam()
  countryIds?: number[];

  @IdListParam()
  departmentIds?: number[];
}
