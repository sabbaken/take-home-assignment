# Employees table — take-home assignment

A small full-stack app that reads the provided MySQL database and shows employees in a table
that can be filtered by role, country and department.

**[Assignment brief](docs/assignment-requerements.md)** · **[API](#api)** ·
**[Decisions and trade-offs](#decisions-and-trade-offs)**

## Stack

- **Monorepo:** npm workspaces — one `npm install` at the root covers both packages
- **Server:** NestJS + TypeORM, read-only, two endpoints under `/api`
- **Client:** React + Vite + TypeScript, Tailwind CSS with shadcn/ui primitives, TanStack Query
- **Database:** the assignment's MySQL image and seed, wrapped in a compose file

## Layout

```
client/src/features/employees   api client, query hooks, filter state, table and panel
client/src/components/ui        shadcn/ui primitives
server/src/employees            GET /api/employees + query DTO with validation
server/src/filters              GET /api/filters
server/src/database/entities    read-only TypeORM entities mapped onto the given schema
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

```
GET /api/filters
→ { countries: Option[], departments: Option[], roles: Option[] }
  Option = { id: number, name: string }

GET /api/employees?roleIds=1,2&countryIds=3&departmentIds=
→ { data: EmployeeRow[], total: number }
  EmployeeRow = { id, firstName, lastName, role, country, department }
```

Multi-value filters are comma-separated ids. An absent or empty parameter means "don't filter by
this dimension". Selections are **OR** within one group and **AND** between groups — picking
_Analyst + Manager_ and _Japan_ returns Japanese analysts and Japanese managers.

## Decisions and trade-offs

- **NestJS for a two-endpoint API** is more structure than this strictly needs. It was chosen for
  the readable module/DTO/validation layout; bare Express would be shorter but would show less
  about how I organise code.
- **No config defaults in code.** The `DB_*` values used to be inline fallbacks in
  `database.module.ts`; they now live only in `server/.env`, validated at boot by
  `server/src/config/env.validation.ts`. Config that silently defaults hides a misconfigured
  environment until the first query.
- **`synchronize: false`** and read-only entities: the schema ships with the assignment and is
  already seeded, so the ORM must never touch it.
- **Filtering happens on the server.** With 40 rows it could just as well happen in the browser,
  but server-side filtering is the version that still works when the table grows, and it is what
  the bonus task implies.
- **The API contract is duplicated** in `client/src/features/employees/types.ts` rather than
  shared through a workspace package: a `packages/shared` would need its own build and resolve
  setup in both Vite and Nest for ~15 lines of types. Worth extracting once the contract grows.
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

- **Tests.** On a single read-only service they would mostly assert that the query builder builds a
  query; the filter combinations were verified against the running API instead.
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
- **Starting over from a clean database**: `npm run db:down` removes the container;
  `docker volume rm assignment_db_data` drops the data so the seed re-runs on the next
  `npm run db:up`.
