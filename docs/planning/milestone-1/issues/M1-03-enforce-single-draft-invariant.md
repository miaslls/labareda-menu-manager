## [Feature] Enforce single DRAFT MenuVersion invariant (domain)

## Problem Statement

Milestone 1 requires the system to guarantee:

Exactly one `MenuVersion` with status `DRAFT` must exist at all times.

At present, the domain layer does not enforce this invariant. Multiple drafts or zero drafts would
be silently accepted, creating undefined behavior and architectural corruption.

The system must fail loudly when the invariant is violated.

---

## Why This Matters Now

Milestone 1’s capability boundary is not “MenuVersion exists.”

It is:

The domain layer can reliably retrieve the draft workspace under the invariant that exactly one
DRAFT exists.

Before implementing draft retrieval (M1-04), the invariant must be enforced deterministically and
tested in isolation.

Invariant enforcement belongs in the domain layer, not in Prisma.

---

## Success Criteria

- [ ] A domain error type is defined for DRAFT invariant violations
- [ ] Error includes compact, debuggable metadata (counts and/or ids)
- [ ] A pure domain function enforces the invariant
- [ ] Function returns the single DRAFT when valid
- [ ] Function throws domain error when:
  - zero DRAFT versions exist
  - more than one DRAFT exists
- [ ] Unit tests cover:
  - exactly one DRAFT → success
  - zero DRAFT → failure
  - two+ DRAFT → failure
- [ ] Tests are DB-free and deterministic

---

## Scope & Constraints

In scope:

- Define a specific domain error (e.g., `DraftInvariantViolationError`)
- Implement a pure invariant checker function that:
  - accepts a collection of `MenuVersion`
  - filters by status
  - validates cardinality
  - returns the single DRAFT
- Add deterministic unit tests
- Ensure error classification aligns with existing domain error taxonomy

Out of scope:

- Draft creation logic
- Repository writes
- Prisma schema changes
- Audience-based read logic
- Auto-healing corrupted state

Constraints:

- No Prisma imports in domain
- No database access in tests
- No silent repair of corruption
- Invariant logic must be pure and easily testable

---

## Architectural Notes

This is the first enforced invariant in the system.

This invariant must:

- Exist only in the domain layer
- Be deterministic
- Fail loudly on corruption
- Remain independent from persistence details

Corruption is surfaced, not corrected.

This establishes the invariant-first philosophy for all future milestones.

---

## Verification Notes

- `npm run test` passes
- Tests clearly demonstrate failure modes
- TypeScript compiles cleanly
- No architectural boundary violations introduced
