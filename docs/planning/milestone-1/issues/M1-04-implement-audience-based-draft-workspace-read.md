## [Feature] Implement audience-based draft workspace read (domain)

## Problem Statement

Milestone 1 requires the domain layer to retrieve the draft workspace deterministically.

Although `MenuVersion` will exist in persistence and the single-DRAFT invariant will be enforceable
(M1-03), there is not yet a domain operation that:

- explicitly accepts an audience context, and
- returns the correct workspace for that audience, and
- guarantees deterministic DRAFT retrieval for `adminEdit`

Without this, the milestone capability is not unlocked.

---

## Why This Matters Now

Audience-based reads are a core architectural decision.

The UI and route layers must not decide lifecycle/visibility rules. The domain must.

Milestone 1 introduces the first concrete audience-based domain read:

- `adminEdit` reads from the DRAFT workspace

This issue wires the repository + invariant enforcement into an explicit domain operation.

---

## Success Criteria

- [ ] Audience type exists/confirmed in domain (`public`, `adminPreview`, `adminEdit`)
- [ ] Domain operation implemented: `getDraftWorkspace(audience)`
- [ ] For `adminEdit`, operation:
  - fetches MenuVersions via repository abstraction
  - applies single-DRAFT invariant enforcement
  - returns the DRAFT deterministically
- [ ] Domain API requires explicit audience argument (no implicit defaults)
- [ ] No Prisma types leak into domain
- [ ] Unit tests exist proving `adminEdit` returns the DRAFT workspace (DB-free)

---

## Scope & Constraints

In scope:

- Define or confirm `Audience` type in domain
- Implement `getDraftWorkspace(audience)` in domain ops layer
- Use `MenuVersionRepository` to load candidate workspaces
- Apply the invariant function from M1-03
- Add DB-free unit tests using a fake/in-memory repository implementation

Out of scope:

- Public reads from PUBLISHED
- Admin preview visibility filters
- Publish flow
- Draft creation/seeding (M1-05)
- Any UI or route handlers

Constraints:

- Domain must not import Prisma
- Repository adapter must not contain business logic
- Tests must be DB-free and deterministic
- Operation must fail loudly if invariant fails (propagate domain error)

---

## Architectural Notes

This issue is the Milestone 1 “capability unlock” path:

Repository → invariant enforcement → deterministic DRAFT retrieval.

The audience parameter is explicit to prevent lifecycle logic from leaking into UI/routes through
“helpful defaults.”

---

## Verification Notes

- `npm run test` passes
- Tests demonstrate:
  - `adminEdit` returns the single DRAFT when valid
  - invariant violations surface as domain error (can be covered directly or indirectly)
- `npm run check` passes
- No layer boundary violations introduced
