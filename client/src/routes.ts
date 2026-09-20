/**
 * Every path the app knows, so links and the router quote the same string.
 * Imports nothing on purpose: components reach for a path without pulling the
 * router — and the pages it renders — in behind it.
 */
export const routes = {
  employees: '/employees',
  roles: '/roles',
  countries: '/countries',
  departments: '/departments',
} as const;
