import { getJson } from '@/lib/api';
import type { ReferenceResource } from './resources';
import type { ReferenceRow } from './types';

/** These endpoints answer with a bare array — no envelope, no pagination. */
export function fetchReference(
  resource: ReferenceResource,
  signal?: AbortSignal,
): Promise<ReferenceRow[]> {
  return getJson<ReferenceRow[]>(`/${resource}`, signal);
}
