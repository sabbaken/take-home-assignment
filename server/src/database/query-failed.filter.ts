import { ArgumentsHost, BadRequestException, Catch, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

/** The MySQL error numbers that mean a client mistake rather than a server bug. */
const MYSQL_ERROR = {
  duplicateEntry: 1062,
  rowIsReferenced: 1451,
  noReferencedRow: 1452,
} as const;

/**
 * Turns a rejected constraint into the HTTP error it really is, so no service
 * needs a `try`/`catch` around its writes. Anything unrecognised is handed to
 * the default filter untouched — a swallowed query bug is worse than a 500.
 */
@Catch(QueryFailedError)
export class QueryFailedFilter extends BaseExceptionFilter {
  override catch(error: QueryFailedError, host: ArgumentsHost): void {
    const errno = (error.driverError as { errno?: number } | undefined)?.errno;

    switch (errno) {
      case MYSQL_ERROR.duplicateEntry:
        return super.catch(new ConflictException('A row with that key already exists'), host);
      case MYSQL_ERROR.rowIsReferenced:
        return super.catch(new ConflictException('The row is still referenced elsewhere'), host);
      case MYSQL_ERROR.noReferencedRow:
        return super.catch(new BadRequestException('A referenced row does not exist'), host);
      default:
        return super.catch(error, host);
    }
  }
}
