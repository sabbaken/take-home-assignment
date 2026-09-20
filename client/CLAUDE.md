# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository. It covers the `client/` workspace; see the root `CLAUDE.md` for the rules that span
both packages.

## Commands

```bash
npm run dev       # vite on :5173, proxying /api to the API on :3000
npm run build     # tsc -b && vite build
npm run lint      # eslint "src/**/*.{ts,tsx}"
```

`npm run dev` alone shows the error states until the API and the database are also up
(`npm run dev` at the root starts both).

## Structure

Feature-first: everything about the screen lives in `src/features/employees/`, and
`src/components/ui/` holds only unowned shadcn primitives. `App.tsx` is the route layout — it sets
one Phosphor `IconContext` default and renders an `<Outlet />`; `routes.tsx` owns the React Router
config; `main.tsx` owns the `QueryClient` (`retry: 1`, no refetch on focus) and renders the
`RouterProvider`.

Within the feature: `api.ts` (fetch + query-string building), `types.ts` (the API contract mirror),
`use-*.ts` hooks, PascalCase components, and `states/` for the empty / error / skeleton views.
`EmployeesPage` is the only stateful composer — it owns the hooks and picks which state to render;
everything below it takes props. Imports use the `@/` alias (Vite + tsconfig paths) for anything
outside the current feature folder, relative paths within it.

## Conventions worth keeping

- **Server-side filtering.** Filter state is ids in `use-employee-filters.ts`; every change refetches
  through `useEmployees`. Never filter the returned rows in the component — with more rows that
  stops being correct.
- **Query keys and caching.** `['employees', filters]` makes the filter object the cache key, so
  filters must stay a plain serialisable object. Employees use `placeholderData: keepPreviousData`
  so toggling a checkbox never flashes the table back to a skeleton; filter options use
  `staleTime: Infinity` as reference data for the page's lifetime.
- **Four render states, in this order:** `isPending` → skeleton, `isError` → `ErrorState` with a
  retry, empty rows → `EmptyState` (offering "clear filters" only when some are set), else the
  table. New data-driven UI follows the same four-way branch instead of rendering `data?.x ?? []`
  blindly.
- **Routing lives in `routes.tsx`.** One data router (`createBrowserRouter`), `App` as the layout
  route, and `/employees` as the only screen; `/` and every unmatched path `<Navigate replace>` to
  it, so there is no 404 page to maintain while there is one page. A second screen is a second
  entry in that array plus a path in the `routes` map — paths belong in that map, never inline in
  a `<Link>`. Data still comes from TanStack Query, not from route loaders.
- **One icon set.** Phosphor only — `components.json` sets `"iconLibrary": "phosphor"`, and shadcn's
  generated `lucide-react` import in `checkbox.tsx` was rewired by hand. If a shadcn `add` pulls in
  lucide, rewire it rather than installing a second icon package.
- **Tailwind v4, CSS-first.** No `tailwind.config` — the palette is CSS variables in `index.css`
  (`:root`, a `.dark` override, exposed through `@theme inline`). Style with the semantic tokens
  (`bg-card`, `text-muted-foreground`, `border`) rather than raw colours: the `.dark` palette is
  defined but nothing toggles the class yet, so a theme switcher stays one edit away. Merge
  conditional classes with `cn()` from `@/lib/utils`.
- **Accessibility is part of the change:** filter groups are `fieldset`/`legend`, every checkbox is
  tied to its `Label` by id, and the result count sits in an `aria-live` region.
