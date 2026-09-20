import { getJson } from '@/lib/api';
import type { Role } from './types';

/** `GET /api/roles` answers with a bare array — no envelope, no pagination. */
export function fetchRoles(signal?: AbortSignal): Promise<Role[]> {
  return getJson<Role[]>('/roles', signal);
}
