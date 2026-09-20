/** Requests go to the same origin; Vite proxies /api to the Nest server in dev. */
const API_BASE = '/api';

/** The one fetch every feature's `api.ts` goes through: JSON in, typed value out. */
export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
