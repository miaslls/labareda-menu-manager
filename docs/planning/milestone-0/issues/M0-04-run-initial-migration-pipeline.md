## [Feature] Run initial migration pipeline

## Problem Statement

The migration pipeline must be verified early to ensure schema evolution is reliable and repeatable.

Without an early validation, later modeling work risks becoming blocked by tooling issues.

---

## Why This Matters Now

Milestone 0 is complete only when the project can be bootstrapped from a clean clone, including migrations.

---

## Success Criteria

* [x] An initial migration is created, applied, and committed
* [x] Migration runs cleanly from a fresh clone
* [x] Database reset flow is verified

---

## Scope & Constraints

In scope:

* Create/apply the initial migration (even if schema is minimal)
* Verify reset workflow

Out of scope:

* Domain entity models (beyond what is necessary to run a migration)

---

## Verification Notes

- `npx prisma migrate dev` succeeds
- `npx prisma migrate reset` succeeds

---

# Evidence — Initial migration pipeline verified (Milestone 0)

Date: 2026-02-12
Verifier: Mia
Goal: Prove Prisma + SQLite migration workflow is reliable and repeatable from a clean clone.

## Preconditions

- Repository cloned locally
- Node + npm available
- No pre-existing local database is assumed
- `.env` exists in repo root with:

  DATABASE_URL="file:./prisma/dev.db"

Notes:
- SQLite database file is expected at `prisma/dev.db` (gitignored).
- Prisma client output is expected at `generated/prisma` (gitignored).
- Prisma config is expected to load dotenv via `prisma.config.ts`.

---

# Evidence — Initial migration pipeline verified (Milestone 0)

Date: 2026-02-12
Verifier: Mia
Result: PASS

Goal
Prove Prisma + SQLite migration workflow is reliable and repeatable from a clean clone.

## Preconditions

- `.env` exists in repo root with:

  DATABASE_URL="file:./prisma/dev.db"

- Expected untracked artifacts:
  - `prisma/dev.db`
  - `generated/prisma/**`

---

## Verification transcript (observed output)

### 1) Validate Prisma configuration and schema

Command:

npm run db:validate

Output:

Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma\schema.prisma.
The schema at prisma\schema.prisma is valid 🚀

### 2) Generate Prisma client

Command:

npm run db:generate

Output:

Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma\schema.prisma.
✔ Generated Prisma Client (7.4.0) to .\generated\prisma in 33ms

### 3) Apply migrations (create DB + apply initial migration)

Command:

npm run db:migrate

Output:

Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma\schema.prisma.
Datasource "db": SQLite database "dev.db" at "file:./prisma/dev.db"

SQLite database dev.db created at file:./prisma/dev.db

Applying migration `20260212173944_smoke_test`

The following migration(s) have been applied:

migrations/
  └─ 20260212173944_smoke_test/
    └─ migration.sql

Your database is now in sync with your schema.

### 4) Reset pipeline (repeatability proof, non-interactive)

Command:

npm run db:reset

Output:

Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma\schema.prisma.
Datasource "db": SQLite database "dev.db" at "file:./prisma/dev.db"

Applying migration `20260212173944_smoke_test`

Database reset successful

The following migration(s) have been applied:

migrations/
  └─ 20260212173944_smoke_test/
    └─ migration.sql

### 5) Prisma Studio connectivity

Command:

npm run db:studio

Output:

Loaded Prisma config from prisma.config.ts.

Prisma Studio is running at: http://localhost:51212

Verification:

- Studio launches successfully.
- Application connects to SQLite database at file:./prisma/dev.db.
- No schema resolution or client errors occur.

Studio terminated manually (Ctrl+C).

---

## Artifact checklist

Tracked (must exist in repo):

- prisma/migrations/migration_lock.toml
- prisma/migrations/20260212173944_smoke_test/migration.sql

Untracked (must remain gitignored):

- prisma/dev.db
- generated/prisma/**

---

## Notes

- Prisma is resolving configuration and schema deterministically via `prisma.config.ts`.
- Reset is non-interactive (`--force`) and re-applies migrations cleanly.

