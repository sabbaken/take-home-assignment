/**
 * Mirror of the server's `roles`, `countries` and `departments` entities — all
 * three are the same two columns, so one row type covers them. Kept as a local
 * copy rather than a shared workspace package; see README → Trade-offs.
 */
export interface ReferenceRow {
  id: number;
  name: string;
}
