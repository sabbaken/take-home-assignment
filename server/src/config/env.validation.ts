import { plainToInstance, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min, validateSync } from 'class-validator';

/**
 * Every variable the server reads, in one place. There are no fallbacks in the
 * code — the values live in `.env` (see `.env.example`), so a missing or
 * malformed one fails the boot here instead of surfacing as a refused MySQL
 * connection on the first request.
 */
export class EnvironmentVariables {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  DB_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_USER!: string;

  // Not @IsNotEmpty: a passwordless MySQL is a valid local setup.
  @IsString()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;
}

export function validateEnv(raw: Record<string, unknown>): EnvironmentVariables {
  const config = plainToInstance(EnvironmentVariables, raw);
  const errors = validateSync(config, { whitelist: true });

  if (errors.length > 0) {
    const details = errors
      .map((error) => `  ${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`)
      .join('\n');

    throw new Error(
      `Invalid environment — check server/.env against server/.env.example:\n${details}`,
    );
  }

  return config;
}
