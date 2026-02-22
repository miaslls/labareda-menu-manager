## [Feature] Introduce MenuVersion domain model + repository boundary

## Problem Statement

Milestone 1 requires domain ownership of the `MenuVersion` concept.

Although persistence will exist after M1-01, the system currently has no domain representation of
`MenuVersion`, no domain-level status type, and no repository abstraction separating business logic
from Prisma.

Without a domain model and repository boundary, invariants cannot be enforced safely in later
issues.

---

## Why This Matters Now

Milestone 1 is domain-first.

Before introducing invariants (M1-03), we must:

- Model `MenuVersion` in the domain layer
- Define a domain-safe status type
- Introduce a repository interface that hides Prisma details
- Ensure no persistence types leak into domain code

This issue establishes the structural boundary required for invariant enforcement.

---

## Success Criteria

- [ ] Domain `MenuVersionStatus` type defined (independent from Prisma enum)
- [ ] Domain `MenuVersion` entity defined with minimal fields required for Milestone 1
- [ ] Repository interface defined in domain layer
- [ ] Prisma-backed repository adapter implemented in persistence layer
- [ ] Mapping between Prisma record and domain entity isolated to adapter
- [ ] No Prisma imports exist in domain files
- [ ] Project compiles with strict TypeScript checks

---

## Scope & Constraints

In scope:

- Create domain folder structure under `app/lib/domain/menu-version/`
- Define domain-safe status type
- Define minimal `MenuVersion` domain representation
- Define `MenuVersionRepository` interface in domain
- Implement Prisma-backed adapter under `app/lib/persistence/menu-version/`
- Isolate mapping logic inside adapter

Out of scope:

- Invariant enforcement
- Draft creation logic
- Audience-based read logic
- Seeding behavior
- Tests (introduced in M1-02.5)

Constraints:

- Domain layer must not import Prisma
- Persistence adapter must not contain business rules
- Mapping logic must not leak into domain
- Folder structure must follow Milestone 1 conventions defined in ISSUE_MAP.md

---

## Architectural Notes

This issue establishes the domain boundary required for enforcing:

> Exactly one `DRAFT` must exist at all times.

However, that invariant is not enforced in this issue.

This issue introduces structure only.

---

## Verification Notes

- TypeScript compiles with no errors
- No architectural layer violations introduced
- Domain files contain zero Prisma imports
- Repository adapter compiles and maps correctly
