## [Feature] Integrate Prisma with SQLite

## Problem Statement

The persistence layer must be initialized before domain modeling and migrations can proceed.

Without Prisma and a local database configuration, schema and data access cannot be validated.

---

## Why This Matters Now

Milestone 0 requires a verified persistence toolchain to prevent later churn.

---

## Success Criteria

- [ ] Prisma is installed and initialized
- [ ] SQLite database configuration exists
- [ ] Prisma client generates successfully
- [ ] Local database file is created when running migrations or studio

---

## Scope & Constraints

In scope:
- Prisma initialization
- SQLite configuration

Out of scope:
- Domain schema modeling (MenuVersion/Category/Item)
- Seed data

---

## Verification Notes

- `npx prisma generate` succeeds
- `npx prisma studio` can start (even if schema is minimal)
