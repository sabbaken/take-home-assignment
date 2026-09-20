import { getJson } from '@/lib/api';
import type { Department } from './types';

/** `GET /api/departments` answers with a bare array — no envelope, no pagination. */
export function fetchDepartments(signal?: AbortSignal): Promise<Department[]> {
  return getJson<Department[]>('/departments', signal);
}
