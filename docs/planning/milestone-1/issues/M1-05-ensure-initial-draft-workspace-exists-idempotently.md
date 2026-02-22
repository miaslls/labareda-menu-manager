## [Feature] Ensure initial DRAFT workspace exists (idempotent, domain)

## Problem Statement

Milestone 1 requires the system to guarantee that at least one `DRAFT` MenuVersion exists.

Right now, a fresh database can legitimately contain zero `MenuVersion` rows, which makes draft
retrieval impossible and forces undefined behavior.

The system must introduce a controlled domain operation that:

- returns the existing DRAFT if present
- creates one if none exist
- does so idempotently (no duplicates)
- preserves the “exactly one DRAFT” invariant

---

## Why This Matters Now

Milestone 1 closes only when:

A clean database produces exactly one DRAFT.

This cannot be guaranteed by read logic alone. We need a domain-owned creation path that is safe to
call repeatedly and results in deterministic state.

This is the system’s first “bootstrap” behavior.

---

## Success Criteria

- [ ] Domain operation implemented: `ensureDraftWorkspace()`
- [ ] Behavior:
  - if exactly one DRAFT exists → return it (no write)
  - if zero MenuVersions exist → create one DRAFT and return it
  - if zero DRAFT exists but other versions exist → fail loudly (invariant violation)
  - if multiple DRAFT exist → fail loudly (invariant violation)
- [ ] Repository contract extended with minimal write capability (create DRAFT)
- [ ] Prisma-backed repository adapter implements the write method
- [ ] Idempotency proven via deterministic tests
- [ ] (If needed) creation uses a transaction to avoid duplicate drafts under concurrency

---

## Scope & Constraints

In scope:

- Add domain op `ensureDraftWorkspace()`
- Extend `MenuVersionRepository` with minimal create method (e.g., `createDraft()`)
- Implement create method in Prisma adapter
- Ensure invariant enforcement is used to validate existing state before deciding to create
- Add deterministic unit tests (DB-free) using fake repository behavior

Out of scope:

- Publishing
- Seeding draft from published
- Public read logic
- Categories/items
- UI and route handlers

Constraints:

- Business rules stay in domain
- Persistence adapter performs only data access + mapping
- No silent repair of corrupted state
- Preserve “exactly one DRAFT” invariant as a hard postcondition

---

## Architectural Notes

This issue introduces controlled creation, not automatic repair.

If the database contains versions but none are DRAFT, or contains multiple DRAFT, the system must
surface corruption and refuse to proceed.

Only the “empty DB” case is allowed to trigger creation.

Concurrency note:

If we anticipate parallel calls to `ensureDraftWorkspace`, draft creation should be protected with a
transaction and/or a persistence constraint strategy. If such protection requires an ADR or schema
constraint, it must be recorded explicitly before being introduced.

---

## Verification Notes

- `npm run test` passes
- Tests cover:
  - empty DB → creates exactly one DRAFT
  - already has one DRAFT → returns it, no duplicate
  - multiple DRAFT → throws invariant error
  - no DRAFT but other versions exist → throws invariant error
- `npm run check` passes
