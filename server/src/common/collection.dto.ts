/**
 * Envelope every list endpoint returns. A bare array leaves nowhere to put a
 * count, a page size or a cursor, so collections ship wrapped from the start.
 */
export interface CollectionDto<T> {
  data: T[];
  total: number;
}
