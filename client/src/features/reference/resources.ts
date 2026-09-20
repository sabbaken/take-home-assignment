/**
 * The three lookup tables the API serves as plain id/name lists. One entry per
 * table drives the route, the request path, the heading and the row count's
 * noun, so adding a fourth lookup means adding a key here and a route.
 */
export const REFERENCE_RESOURCES = {
  roles: { title: 'Roles', noun: ['role', 'roles'] },
  countries: { title: 'Countries', noun: ['country', 'countries'] },
  departments: { title: 'Departments', noun: ['department', 'departments'] },
} as const satisfies Record<string, { title: string; noun: readonly [string, string] }>;

/** Also the path segment under `/api` — `roles` is `GET /api/roles`. */
export type ReferenceResource = keyof typeof REFERENCE_RESOURCES;
