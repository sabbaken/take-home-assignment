# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository. It covers the `server/` workspace; see the root `CLAUDE.md` for the rules that span
both packages.

## Commands

```bash
npm run start:dev   # nest start --watch (or `npm run dev` at the root for API + client)
npm run build       # nest build → dist/
npm run lint        # eslint "src/**/*.ts"
```

The API needs MySQL up (`npm run db:up` at the root) — without it Nest boots but every request
fails at the connection.

## Shape of the API

Two read-only GET endpoints, both under the global `api` prefix set in `main.ts`:

- `GET /api/filters` — all three option lists in one response, so the page needs one round trip
  instead of three.
- `GET /api/employees?roleIds=1,2&countryIds=3` — comma-separated ids per dimension. **OR inside a
  group, AND between groups**: ids within one parameter become one `IN (...)`, each dimension a
  separate `andWhere`. Preserve that semantic — it is what the bonus task asks for.

Responses are `{ data, total }`, not bare arrays, so pagination can be added without a break.

## Module layout

`app.module.ts` wires a global `ConfigModule`, `DatabaseModule`, and one module per endpoint.
A feature module is controller + service + `dto/`; the controller only validates and delegates,
all query building lives in the service.

- **`database/`** — `TypeOrmModule.forRootAsync` reading `DB_*` from config with the assignment's
  values as defaults (so the server runs with no `.env`), and `synchronize: false`.
- **`database/entities/`** — read-only mirrors of the given schema, re-exported from
  `entities/index.ts` (import from there, not from the individual files). Columns are snake_case in
  MySQL and camelCase in TS, mapped explicitly via `@Column({ name: 'first_name' })`. All three
  relation FKs are nullable, so entity relations are `T | null` and joins must stay
  `leftJoinAndSelect` — an employee with no role still belongs in the unfiltered table.
- **`*/dto/`** — two kinds: request DTOs are classes with `class-validator` decorators (a global
  `ValidationPipe` with `whitelist: true, transform: true` runs in `main.ts`), response DTOs are
  plain interfaces describing the flat JSON. Entities are never returned directly; services map
  them to flat rows (`role: employee.role?.name ?? null`).

## Adding a filter dimension

The query DTO composes its validation into one reusable `IdListParam()` decorator
(`employees/dto/find-employees-query.dto.ts`) that parses `?ids=1,2`, drops empty values, and leaves
non-numeric entries as strings so `@IsInt` rejects them with a 400. A new dimension is: the entity
relation, one `@IdListParam()` field on the DTO, one `applyIdFilter` call in the service, and the
matching option list in `FiltersService` — then the mirrored change on the client.
