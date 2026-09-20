# Employees table — take-home assignment

A small full-stack app that reads the provided MySQL database and shows employees in a table
that can be filtered by role, country and department. Behind that page the API exposes a full
REST resource for every table in the schema.

**[Assignment brief](docs/assignment-requerements.md)** · **[API](#api)** ·
**[Decisions and trade-offs](#decisions-and-trade-offs)**

## Stack

- **Monorepo:** npm workspaces — one `npm install` at the root covers both packages
- **Server:** NestJS + TypeORM, one REST resource per table under `/api`
- **Client:** React + Vite + TypeScript, Tailwind CSS with shadcn/ui primitives, TanStack Query
- **Database:** the assignment's MySQL image and seed, wrapped in a compose file

## Layout

```
client/src/features/employees   api client, query hooks, filter state, table and panel
client/src/components/ui        shadcn/ui primitives
server/src/employees            /api/employees — CRUD plus the filtered table query
server/src/countries            /api/countries   — a reference table: controller, service, DTOs
server/src/departments          /api/departments — likewise
server/src/roles                /api/roles       — likewise
server/src/filters              /api/filters — the three option lists in one response
server/src/database             entities mapped onto the given schema, id allocation, the
                                filter that turns a driver error into a 400/409
server/src/common               the `{ data, total }` envelope the list endpoints share
server/db                       Dockerfile, seed.sql and the compose file for MySQL
docs                            the original assignment brief
```

## Quick start

**Prerequisites:** Node.js **20+** (developed on 22) and Docker.

```bash
npm install     # installs both workspaces
npm run db:up   # builds and starts MySQL from the assignment's Dockerfile
npm run dev     # starts the API (:3000) and the client (:5173) together
```

Then open **http://localhost:5173**.

> **`server/.env` ships with the project** and already holds the assignment's credentials
> (`root/password@localhost:3306/assignment_db`), so the three commands above are all that is
> needed. See [Configuration](#configuration-environment-variables).

The database lives in [`server/db`](server/db): the assignment's `Dockerfile` and `seed.sql`,
plus a compose file. It is also startable exactly as the assignment describes —
`docker build -t assignment_db .` + `docker run ...` from that folder; `npm run db:up` is just a
convenience wrapper that adds a healthcheck and a named volume.

### Scripts

| Command                             | What it does                                       |
| ----------------------------------- | -------------------------------------------------- |
| `npm run dev`                       | API and client together, in one terminal           |
| `npm run start:server`              | API only, watch mode — <http://localhost:3000/api> |
| `npm run start:client`              | Client only — <http://localhost:5173>              |
| `npm run db:up` / `npm run db:down` | Start / stop the database container                |
| `npm run lint`                      | ESLint over both packages                          |
| `npm run format`                    | Prettier over both packages                        |

### Configuration (environment variables)

The server reads everything from [`server/.env`](server/.env) — there are no fallbacks in the
code. All six variables are required; a missing or malformed one stops the boot with a message
naming it, instead of failing later as a refused connection.

| Variable      | Shipped value   | Purpose                                      |
| ------------- | --------------- | -------------------------------------------- |
| `PORT`        | `3000`          | Port the API listens on                      |
| `DB_HOST`     | `localhost`     | MySQL host                                   |
| `DB_PORT`     | `3306`          | MySQL port (the compose file publishes this) |
| `DB_USER`     | `root`          | MySQL user                                   |
| `DB_PASSWORD` | `password`      | MySQL password                               |
| `DB_NAME`     | `assignment_db` | Database name                                |

`server/.env` is committed **on purpose**: these are the assignment container's own local
credentials, not secrets, and the file makes the delivered project run without a setup step.
[`server/.env.example`](server/.env.example) is the template a real deployment would copy.
The client needs no configuration — Vite proxies `/api`, so there is no `VITE_API_URL`.

## API

### The table

```
GET /api/employees?roleIds=1,2&countryIds=3&departmentIds=
→ { data: EmployeeRow[], total: number }
  EmployeeRow = { id, firstName, lastName, role, country, department }

GET /api/filters
→ { countries: Option[], departments: Option[], roles: Option[] }
  Option = { id: number, name: string }
```

Multi-value filters are comma-separated ids. An absent or empty parameter means "don't filter by
this dimension". Selections are **OR** within one group and **AND** between groups — picking
_Analyst + Manager_ and _Japan_ returns Japanese analysts and Japanese managers.

`GET /api/filters` is a view over the three reference resources below, not a resource of its own:
the filter bar needs all three lists at once and shouldn't pay for three round trips.

### Resources

Every table is a full REST resource. `<resource>` is `employees`, `countries`, `departments` or
`roles`:

```
GET    /api/<resource>        → { data: T[], total: number }
GET    /api/<resource>/:id    → T
POST   /api/<resource>        → 201, the created T
PATCH  /api/<resource>/:id    → the updated T
DELETE /api/<resource>/:id    → 204
```

`countries`, `departments` and `roles` are the same two columns three times over, and each has
its own controller and service anyway — `{ id, name }` in and out, with a body of
`{ "name": "..." }`. Employees take the relations as ids:

```jsonc
// POST /api/employees
{ "firstName": "Ada", "lastName": "Lovelace", "roleId": 1, "countryId": 2, "departmentId": 3 }
```

All three ids are optional (the columns are nullable), and on `PATCH` an explicit `null` clears
the relation while an absent key leaves it alone. Responses stay flat — `role` is the name, never
a nested object.

### Status codes

| Code  | When                                                                                     |
| ----- | ---------------------------------------------------------------------------------------- |
| `400` | A body or query parameter failed validation, or a `*Id` names a row that is gone         |
| `404` | No row with that id                                                                      |
| `409` | Deleting a row another table still references, or two creates racing for the same new id |

Constraint violations are translated from the driver's error numbers by one global exception
filter, [`database/query-failed.filter.ts`](server/src/database/query-failed.filter.ts); anything
unrecognised is passed on to Nest's default filter rather than dressed up as a client error.

## Decisions and trade-offs

- **NestJS** is more structure than the assignment's one table strictly needs. It was chosen for
  the readable module/DTO/validation layout; bare Express would be shorter but would show less
  about how I organise code — and it is what makes the rest of the schema cheap to expose.
- **No config defaults in code.** The `DB_*` values used to be inline fallbacks in
  `database.module.ts`; they now live only in `server/.env`, validated at boot by
  `server/src/config/env.validation.ts`. Config that silently defaults hides a misconfigured
  environment until the first query.
- **The schema is read-only; the data is not.** `synchronize: false` stays, and the entities are
  hand-written mirrors of the given `seed.sql` — the ORM must never alter a schema that ships with
  the assignment. The rows themselves are writable through the API, because an employees service
  that cannot add an employee is not a service anyone would ship. Note that the container is
  rebuilt from the seed, so writes survive a restart but not a `db:down` + `db:up`.
- **Four plain resources, no shared base class.** Every table has its own controller, service and
  DTOs, written out. An earlier version of this API factored the five operations into a generic
  `CrudService` / `LookupController` pair that each resource inherited: shorter to write, worse to
  read — the routes existed only as decorators on an abstract class, and nothing inside
  `countries/` told you what `GET /api/countries` returned. The three reference services being
  near copies of each other is the trade, and at four tables it is the right one.
- **Ids are allocated by the API.** No table in the given schema has `AUTO_INCREMENT`, so `create`
  reads `MAX(id) + 1` and inserts (never `save`, which would quietly update a row that already
  holds that id). Two simultaneous creates can read the same number: the primary key rejects the
  loser and it gets a `409` to retry on. Deliberately not a retry loop in the service, and
  deliberately not `SELECT MAX(id) ... FOR UPDATE` — the lock deadlocks against its own insert,
  reproducibly, with three parallel requests.
- **Foreign keys are checked by the database, not by the service.** A `POST` with
  `"countryId": 999` reaches MySQL and comes back as a `400`. Validating the three ids up front
  would name the offending field, at the cost of three extra queries per write and a service that
  has to know about the other three modules.
- **Filtering happens on the server.** With 40 rows it could just as well happen in the browser,
  but server-side filtering is the version that still works when the table grows, and it is what
  the bonus task implies.
- **The API contract is duplicated** in `client/src/features/employees/types.ts` rather than
  shared through a workspace package: a `packages/shared` would need its own build and resolve
  setup in both Vite and Nest for ~15 lines of types. Worth extracting once the contract grows.
  The client mirrors only the two responses it reads; the write DTOs have no client-side twin
  because the page never posts.
- **Response shape is `{ data, total }`**, not a bare array, so pagination or metadata can be
  added without a breaking change.
- **`keepPreviousData`** keeps the current rows on screen while a new filter combination loads, so
  toggling a checkbox doesn't flash the table back to a skeleton.
- **One icon set.** shadcn generates its checkbox with a `lucide-react` icon; that import was
  rewired to Phosphor so the project doesn't carry two icon packages.
- **One npm override.** `@nestjs/platform-express` pins `multer` 2.2.0, which carries a known
  advisory; the root `package.json` overrides it to 2.4.0 (same major, and the app never uses
  multer anyway) so a fresh install audits clean.
- **Vite proxies `/api`** to the API server, which keeps the app same-origin in dev — no CORS setup
  and no `VITE_API_URL` to configure. CORS is enabled server-side anyway, in case the client is
  pointed straight at port 3000.

## Deliberately left out

These are choices, not oversights:

- **Tests.** The behaviour worth covering — the filter combinations, the status codes, the id
  race — was verified against the running API instead. Four resources repeating one set of status
  codes is the point where a Jest + Supertest suite starts paying for itself; it is the first
  thing I would add next.
- **Pagination** — 40 rows. The response shape is already ready for it.
- **Column sorting** — not part of the requirements. The natural next step would be TanStack Table
  on top of the existing shadcn table.
- **Filter state in the URL** — nice for sharing a filtered view, out of scope here.

## Troubleshooting

- **Port 3306 already in use** (a local MySQL is running): change the host side of the mapping in
  [`server/db/docker-compose.yml`](server/db/docker-compose.yml) to e.g. `'3307:3306'`, then set
  `DB_PORT=3307` in `server/.env`.
- **The client shows "Could not load employees"**: the API or the database isn't up. Check
  `npm run db:up` and that port 3000 is free.
- **Undoing writes made through the API**, or **starting over from a clean database**:
  `npm run db:down` removes the container; `docker volume rm assignment_db_data` drops the data so
  the seed re-runs on the next `npm run db:up`. The seed is the source of truth — nothing written
  through `POST` / `PATCH` / `DELETE` survives that.
