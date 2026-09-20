/**
 * Mirror of the server's `countries` entity — a local copy rather than a shared
 * workspace package; see README → Trade-offs.
 */
export interface Country {
  id: number;
  name: string;
}
