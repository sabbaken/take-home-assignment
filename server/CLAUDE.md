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
fails at the connection. It also needs `server/.env`; the file is committed, and if it is missing
or a variable is malformed the boot stops with an error naming the variable.

## Shape of the API

Everything sits under the global `api` prefix set in `main.ts`.

Four resources — `employees`, `countries`, `departments`, `roles` — each with the same five
routes: `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id` (204). Every resource writes
those routes out in its own controller; there is no shared base class. `GET /api/employees` is
the one list wrapped in `{ data, total }` — the page prints that count and pagination would land
there — and it maps rows to a flat DTO (`role` is a name, not a nested object). The reference
tables return plain arrays of the `{ id, name }` entity.

Two endpoints carry behaviour beyond the base:

- `GET /api/employees?roleIds=1,2&countryIds=3` — comma-separated ids per dimension. **OR inside a
  group, AND between groups**: ids within one parameter become one `IN (...)`, each dimension a
  separate `andWhere`. Preserve that semantic — it is what the bonus task asks for. It is the
  only list endpoint that takes filters.
- `GET /api/filters` — a view over the three lookup services, not a resource of its own: all three
  option lists in one response, so the page needs one round trip instead of three.

404s are thrown by the services: `update` and `remove` call `findOne` first, because `DELETE` on
a row that was never there reports the same nothing as a successful one. 400 and 409 come from
`database/query-failed.filter.ts`, a global exception filter that maps the MySQL errno and
**hands anything it does not recognise to the default filter** — a swallowed query bug is worse
than a 500. Do not widen that map.

## Module layout

`app.module.ts` wires a global `ConfigModule`, `DatabaseModule`, and one module per resource plus
`FiltersModule`. A feature module is controller + service + `dto/`, all four written out per resource.
The controller only validates and delegates; all query building lives in the service.

- **`config/env.validation.ts`** — the one list of environment variables, as a class-validator
  class checked by `ConfigModule`'s `validate` at boot. **No config fallbacks in code:** the
  values live in `server/.env` (committed — the assignment's local DB credentials, so the
  delivered archive runs as-is) with `.env.example` as the template. A new variable is a field
  here plus a line in both env files and the README table; read it back through
  `ConfigService<EnvironmentVariables, true>` with `{ infer: true }`, never `process.env`.
- **`database/`** — `TypeOrmModule.forRootAsync` reading the validated `DB_*` from config, and
  `synchronize: false`.
- **`database/query-failed.filter.ts`** — the only place a driver error becomes an HTTP status:
  duplicate key → 409, row still referenced → 409, missing referenced row → 400.
- **`database/entities/`** — mirrors of the schema in `db/seed.sql`, re-exported from
  `entities/index.ts` (import from there, not from the individual files). Columns are snake_case in
  MySQL and camelCase in TS, mapped explicitly via `@Column({ name: 'first_name' })`. Ids are
  `@PrimaryGeneratedColumn` — the seed declares the four `id` columns `auto_increment`, so MySQL
  allocates them and `create` is a plain `save()` with no id in it. All three
  relation FKs are nullable, so entity relations are `T | null` and joins must stay
  `leftJoinAndSelect` — an employee with no role still belongs in the unfiltered table.
- **`*/dto/`** — two kinds: request DTOs are classes with `class-validator` decorators (a global
  `ValidationPipe` with `whitelist: true, transform: true` runs in `main.ts`), response DTOs are
  plain interfaces describing the flat JSON, declared by the resource that answers with them —
  there is no shared response type. An entity is returned as it is only where it already _is_ the
  contract (the `{ id, name }` reference tables); anything with relations gets a mapper
  (`role: employee.role?.name ?? null`).

## Adding a resource

A reference table is five plain files — copy `roles/`, swap the entity and the path:

- `dto/create-role.dto.ts` and `dto/update-role.dto.ts` — the same field, required then optional
- `roles.service.ts` — five methods over an injected `Repository<Role>`
- `roles.controller.ts` — the five routes, spelled out
- `roles.module.ts` — `TypeOrmModule.forFeature([Role])`, and it **exports the service**, which is
  how `FiltersModule` reuses it instead of injecting the repository again

Then add the module to `app.module.ts`. The three reference resources are near copies of each
other **on purpose**: three fifty-line services a reader can follow beat one generic base class
they have to decode first. If a fifth reference table shows up, copy again — the moment to
reconsider is when the copies stop being identical.

A table with relations looks like `employees/`: the same five methods, plus `leftJoinAndSelect`
for the columns the DTO flattens and a `toRow` mapper. Incoming foreign keys are not checked
first — the database rejects a bad one and the filter turns it into a 400.

## Adding a filter dimension

The query DTO composes its validation into one reusable `IdListParam()` decorator
(`employees/dto/find-employees-query.dto.ts`) that parses `?ids=1,2`, drops empty values, and leaves
non-numeric entries as strings so `@IsInt` rejects them with a 400. A new dimension is: the entity
relation, one `@IdListParam()` field on the DTO, one `applyIdFilter` call in the service, and the
matching option list in `FiltersService` — then the mirrored change on the client.
