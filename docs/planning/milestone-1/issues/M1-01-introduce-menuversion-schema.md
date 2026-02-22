## [Feature] Introduce MenuVersion schema (Prisma)

## Problem Statement

Milestone 1 requires a workspace model (`MenuVersion`) to represent draft vs published menu states.

The repository currently has no `MenuVersion` persistence model, which blocks all domain work that
must reference a draft workspace.

---

## Why This Matters Now

Milestone 1’s capability boundary depends on a real, migrated schema shape for `MenuVersion` before
we model it in the domain layer.

This issue intentionally introduces persistence shape only. No invariants. No seeding. No domain
behavior.

---

## Success Criteria

- [ ] Prisma schema includes `MenuVersion` model
- [ ] Prisma schema includes `MenuVersionStatus` enum with: `DRAFT`, `PUBLISHED`, `REPLACED`
- [ ] A migration is generated and applies cleanly
- [ ] Prisma client generation succeeds
- [ ] Toolchain verification passes without introducing unexpected tracked artifacts

---

## Scope & Constraints

In scope:

- Add `MenuVersion` model to `prisma/schema.prisma`
- Add `MenuVersionStatus` enum to `prisma/schema.prisma`
- Define minimal fields required for Milestone 1 persistence:
  - `id`
  - `status`
  - timestamps (`createdAt`, `updatedAt`)

Out of scope:

- Enforcing “exactly one DRAFT”
- Any draft seeding behavior
- Any domain types or repository abstractions
- Any UI or route handlers
- Any publish logic

Constraints:

- Schema must remain consistent with the frozen architecture workspace model (MenuVersion B1).

---

## Verification Notes

From a clean working tree:

- `npm run db:validate`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:reset`
- `npm run check`

Expected result:

- Migration applies successfully
- Prisma client generates successfully
- No unexpected tracked files change
