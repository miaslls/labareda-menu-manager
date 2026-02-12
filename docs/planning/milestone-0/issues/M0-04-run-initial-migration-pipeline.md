# docs/planning/milestone-0/issues/M0-04-run-initial-migration-pipeline.md
## [Feature] Run initial migration pipeline

## Problem Statement

The migration pipeline must be verified early to ensure schema evolution is reliable and repeatable.

Without an early validation, later modeling work risks becoming blocked by tooling issues.

---

## Why This Matters Now

Milestone 0 is complete only when the project can be bootstrapped from a clean clone, including migrations.

---

## Success Criteria

- [ ] An initial migration is created, applied, and committed
- [ ] Migration runs cleanly from a fresh clone
- [ ] Database reset flow is verified

---

## Scope & Constraints

In scope:
- Create/apply the initial migration (even if schema is minimal)
- Verify reset workflow

Out of scope:
- Domain entity models (beyond what is necessary to run a migration)

---

## Verification Notes

- `npx prisma migrate dev` succeeds
- `npx prisma migrate reset` succeeds
