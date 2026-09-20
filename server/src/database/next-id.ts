import { ObjectLiteral, Repository } from 'typeorm';

/**
 * No table in the given schema is `AUTO_INCREMENT` — the ids are part of the
 * seed data — so a `POST` has to pick one. `MAX(id) + 1` is read and inserted;
 * if two requests read the same number, the primary key rejects the second one
 * and the caller gets a 409 (see `query-failed.filter.ts`) instead of a row
 * quietly overwriting another.
 */
export async function nextId<T extends ObjectLiteral>(repository: Repository<T>): Promise<number> {
  const row = await repository
    .createQueryBuilder('row')
    .select('COALESCE(MAX(row.id), 0) + 1', 'nextId')
    .getRawOne<{ nextId: number | string | null }>();

  return Number(row?.nextId ?? 1);
}
