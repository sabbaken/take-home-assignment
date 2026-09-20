import { getJson } from '@/lib/api';
import type { Country } from './types';

/** `GET /api/countries` answers with a bare array — no envelope, no pagination. */
export function fetchCountries(signal?: AbortSignal): Promise<Country[]> {
  return getJson<Country[]>('/countries', signal);
}
