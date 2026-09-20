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

Feature-first, one folder per table: `src/features/employees/` (the assignment's screen) plus
`roles/`, `countries/` and `departments/`. Outside them, `src/components/ui/` holds only unowned
shadcn primitives, `src/components/layout/` the app chrome (`AppSidebar`, `PageHeader`),
`src/components/states/` the empty / error / skeleton views every feature renders, and
`src/lib/api.ts` the one `fetch` wrapper every feature's `api.ts` goes through. There is no
`src/hooks/`: the one hook shadcn generates (`use-mobile`, for the sidebar) is `isMobile` from
`react-device-detect` instead.

`App.tsx` is the route layout — one Phosphor `IconContext` default, `SidebarProvider` +
`AppSidebar` + `SidebarInset` around an `<Outlet />`, and nothing else; `router.tsx` owns the
React Router config and `routes.ts` the path map; `main.tsx` owns the `QueryClient` (`retry: 1`,
no refetch on focus) and renders the `RouterProvider`.

Within a feature: `api.ts` (fetch + query-string building), `types.ts` (the API contract mirror),
`use-*.ts` hooks and PascalCase components. **One component per file, named after it** —
`RolesPage.tsx` holds `RolesPage` and nothing else, `RolesContent.tsx` the `*Content` it renders.
The `*Page` is the only stateful composer in each folder — it owns its hooks and renders the
header, the layout and a `*Content` sibling that picks the state; everything below those takes
props. Imports use the `@/` alias (Vite + tsconfig paths)
for anything outside the current feature folder, relative paths within it.

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
- **That branch is guard clauses in a `*Content` component, never a ternary chain in JSX.** Each
  screen is a `*Page` that renders the header and the layout, and a `*Content` in its own file
  that does nothing but `if (…) return <State />` — the skeleton's `COLUMN_WIDTHS` lives there
  too, next to the only component that reads it. `*Content` takes the query itself
  (`UseQueryResult<T>`) rather than unpacked flags, which is what makes `query.data` a `T` after
  the first two guards — that is why no page needs `data ?? []`. The same split is why
  `FiltersPanel` hands its three states to a `FilterGroups` child, which falls back to
  `FiltersSkeleton`.
- **Keep branching out of JSX generally.** A `? :` that picks between two elements is fine
  (`selectedCount > 0 ? <Button /> : null`); a chain of them is not. Name the value above the
  `return` (`const count: RowCount = …`), pull the formatting into a function (`formatCount` in
  `PageHeader`, `renderValue` in `EmployeesTable`), or split off a component with guard clauses.
  JSX should read as the shape of the markup, not as the decision tree behind it.
- **Routing is `router.tsx` plus `routes.ts`.** One data router (`createBrowserRouter`), `App` as
  the layout route, four screens under it; `/` and every unmatched path `<Navigate replace>` to
  `/employees`, so there is no 404 page to maintain. A new screen is an entry in that array, a
  path in `routes.ts` and an item in `AppSidebar`'s `NAV_GROUPS` — paths belong in that map, never
  inline in a `<Link>`. **`routes.ts` imports nothing on purpose:** it used to live in
  `router.tsx`, and the nav reading a path from there closed a cycle
  (`router` → `App` → `AppSidebar` → `router`) that crashed the app with _"Cannot access 'routes'
  before initialization"_. Data still comes from TanStack Query, not from route loaders.
- **Navigation is the sidebar's job; the header only says where you are.** `AppSidebar` is
  `collapsible="icon"` (⌘/Ctrl-B, state kept in a cookie by the shadcn primitive) and groups the
  links: "Directory" for employees, "Reference data" for the three lookup tables. It has **no
  header row** — the app is not a product with a name, so a logo/wordmark there would be invented
  chrome; the sidebar is the link list and nothing else. `PageHeader`
  carries the sidebar trigger, the `<h1>` and the row count, and **each page renders it itself**
  rather than the layout doing it — the count is the page's own query result, so it stays a prop
  instead of travelling up through a context. Its `count` prop is the exported `RowCount`
  (`number | 'loading' | null`), where `null` is "the fetch failed, show nothing".
- **One feature folder per table, like the server's one module per table.** `roles/`, `countries/`
  and `departments/` are near copies of each other — same two columns, same four render states —
  and stay that way on purpose: the point of a screen per table is that one of them can grow a
  filter, a column or a form without the other two inheriting it, and without a `resource` prop
  threading through a shared page. A fifth table is a copy of `roles/` with the type, the path and
  the strings swapped, plus a route and a nav item. The `{ id, name }` row is declared once per
  folder rather than shared.
- **The state views are shared, not per-feature.** `ErrorState`, `EmptyState` and `TableSkeleton`
  live in `src/components/states/` because every feature renders them. They take copy as props —
  `EmptyState` an optional Phosphor `icon` and an `action` node, `TableSkeleton` one width class
  per column. Feature-specific wording stays at the call site.
- **Flat surfaces, no cards.** Structure comes from rules, spacing and type scale — `border-t` above
  a table, `divide-y` between filter groups — not from boxing every region in
  `bg-card rounded-xl border`. The stacked-cards look is the thing to avoid; `ErrorState` keeps its
  tinted panel because that one is a status colour, not decoration.
- **Pointer cursors come from `index.css`.** Tailwind v4 drops the browser default, so one base rule
  (`button:not(:disabled)`, `[role='button']`) covers every shadcn control, Radix's
  `<button role="checkbox">` included. Don't sprinkle `cursor-pointer` per component.
- **Every `shadcn add` needs the same three fixes.** The CLI generates components with a
  `lucide-react` icon (rewire to Phosphor — `components.json` sets `"iconLibrary": "phosphor"`,
  and a second icon package is not worth it), with `cn` imported from an unrelated npm package
  called `cn` (it belongs to `@/lib/utils`), and with the `radix-ui` umbrella package (the rest of
  the project depends on the single `@radix-ui/react-*` packages). Check those three before
  committing what the CLI wrote, and uninstall what it added. It also **overwrites primitives that
  are already there** — `sidebar` rewrote `button.tsx` and `skeleton.tsx`; `git checkout` those
  back. The sidebar's CSS variables arrive as `hsl()` while this palette is `oklch()` neutral;
  they were converted by hand in `index.css`.
- **`src/components/ui/**` is exempt from `react-refresh/only-export-components`** in
  `eslint.config.js`. Upstream ships hooks next to components there (`sidebar.tsx` exports
  `useSidebar`); that is not ours to reorganise, and the rule only guards dev HMR.
- **Tailwind v4, CSS-first.** No `tailwind.config` — the palette is CSS variables in `index.css`
  (`:root`, a `.dark` override, exposed through `@theme inline`). Style with the semantic tokens
  (`bg-card`, `text-muted-foreground`, `border`) rather than raw colours: the `.dark` palette is
  defined but nothing toggles the class yet, so a theme switcher stays one edit away. Merge
  conditional classes with `cn()` from `@/lib/utils`.
- **Accessibility is part of the change:** filter groups are `fieldset`/`legend`, every checkbox is
  tied to its `Label` by id, and the result count sits in an `aria-live` region.
