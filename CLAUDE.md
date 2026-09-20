# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A take-home assignment: read the MySQL database that ships with the task
([`docs/assignment-requerements.md`](docs/assignment-requerements.md)) and show its employees in a
table filterable by role, country and department. It is a portfolio piece — a reviewer will read
the code and the README, so clarity of the layout matters as much as working behaviour.

The brief only asks for that one table. The API deliberately goes further: every table in the
schema is a full CRUD resource, because a service that can only read is not one anybody ships.

npm workspaces monorepo, one `npm install` at the root covers both packages:

- `client/` — React + Vite SPA. See [`client/CLAUDE.md`](client/CLAUDE.md).
- `server/` — NestJS + TypeORM API under `/api`. See [`server/CLAUDE.md`](server/CLAUDE.md).
- `server/db/` — the assignment's `Dockerfile` + `seed.sql`, plus a compose file (`name: assignment`).
- `docs/` — the original brief and its example gif. Reference material, not project docs.

## Commands

Run everything from the repo root; the workspace scripts delegate with `-w server` / `-w client`.

```bash
npm install
npm run db:up          # MySQL on :3306 (compose file lives in server/db)
npm run dev            # API :3000 + client :5173 together
npm run start:server   # API only, watch mode
npm run start:client   # client only
npm run lint           # ESLint over both packages
npm run format         # Prettier over both packages
npm run db:down
```

**There is no test runner in this repo** — no Jest, no Vitest, no `npm test`. That is a documented
choice (README → "Deliberately left out"), not a gap to fill silently. Verify changes by running the
app and hitting the API; if a change warrants tests, propose adding the tooling first.

## Rules that span both packages

- **The schema comes from `server/db/seed.sql`, and the ORM never touches it.** `synchronize`
  stays `false` and the entities stay hand-written mirrors of that file. The seed carries exactly
  one deliberate edit to the assignment's original — `auto_increment` on the four `id` columns,
  so MySQL allocates ids instead of the API (see README → Trade-offs). Any further schema change
  is an edit to that file plus the matching entity, never a `synchronize` run. The **rows** are
  writable: every table has `POST`, `PATCH` and `DELETE`. A seed edit only reaches a running
  database through `npm run db:down`, `docker volume rm assignment_db_data`, `npm run db:up` —
  the image is rebuilt by `db:up`, but MySQL runs the seed only on an empty data directory. Keep
  in mind while testing that a manual check against the running API leaves rows behind unless it
  cleans up after itself.
- **A resource is a plain Nest module** — controller, service, DTOs, written out per table, with
  no shared base class. A new table is a copy of `server/src/roles/` with the entity and the path
  swapped, not an inheritance hierarchy — see `server/CLAUDE.md` → "Adding a resource".
- **The API contract is duplicated on purpose.** The server DTOs
  (`server/src/employees/dto/`, `server/src/filters/dto/`) and
  `client/src/features/employees/types.ts` are hand-kept mirrors — a shared workspace package was
  rejected as overkill for ~15 lines. Any change to a contract the client reads must touch both
  sides in the same commit. The client mirrors only `GET /api/employees` and `GET /api/filters`;
  the write DTOs have no client-side twin, and adding one would be dead code until the page posts.
- **Dev is same-origin.** Vite proxies `/api` to the API, so the client never needs a base URL and
  there is no `VITE_API_URL`. Keep fetches relative.
- **Formatting is Prettier** (single quotes, trailing commas, `printWidth: 100`) plus
  `.editorconfig`. Run `npm run format` rather than hand-aligning.
- **Keep the README true.** It documents the structure, the scripts, the env vars and the
  trade-offs; a change to any of those is incomplete until the README matches.
- **Commits are Conventional Commits** with a package scope where it applies:
  `feat(server):`, `fix(client):`, `docs:`, `chore:`.
