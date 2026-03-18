# Milestone 1 - Issue Map

Status: Closed planning artifact (Milestone 1 completed on 2026-03-18). Purpose: Record the issue
sequence used to close Milestone 1 - Draft Workspace Exists. Last reviewed: 2026-03-18.

Milestone capability target (achieved):

The domain layer can reliably retrieve the draft `MenuVersion` workspace with the invariant that
exactly one `DRAFT` exists.

---

# Issue Sequence Overview

Milestone 1 executed in tightly scoped steps with no UI or route-handler work:

1. M1-01 - MenuVersion schema
2. M1-02 - Domain model + repository boundary
3. M1-02.5 - Vitest harness
4. M1-03 - Single-DRAFT invariant
5. M1-04 - Audience-based draft read (`adminEdit`)
6. M1-05 - Empty-db bootstrap via `ensureDraftWorkspace`
7. M1-06 - Integration verification proof artifact

---

# Naming and Placement Conventions Used in Implementation

## Domain layer

- Domain types live in `app/lib/domain/**`
  - Example: `app/lib/domain/menu-version/MenuVersion.ts`
- Domain operations for Milestone 1 currently live directly under `app/lib/domain/menu-version/**`
  - Examples:
    - `app/lib/domain/menu-version/requireSingleDraftMenuVersion.ts`
    - `app/lib/domain/menu-version/getDraftWorkspace.ts`
    - `app/lib/domain/menu-version/ensureDraftWorkspace.ts`
- Domain error base and shared error types:
  - `app/lib/domain/errors/DomainError.ts`
  - `app/lib/domain/errors/UnsupportedAudienceError.ts`
- Invariant-specific error:
  - `app/lib/domain/menu-version/DraftInvariantViolationError.ts`

## Repository contracts

- Repository interfaces live in `app/lib/domain/**/repositories/**`
  - Example: `app/lib/domain/menu-version/repositories/MenuVersionRepository.ts`

## Persistence adapters

- Prisma-backed implementations live in `app/lib/persistence/**`
  - Example: `app/lib/persistence/menu-version/PrismaMenuVersionRepository.ts`
- Mapping between Prisma records and domain entities is isolated in adapters (`mapStatus.ts`).

## Tests

- DB-free domain tests live in `app/lib/domain/__tests__/**`.
- Milestone proof integration test lives in `scripts/proof-m1.integration.test.ts`.

---

# Invariant Introduced in Milestone 1

Exactly one `MenuVersion` with status `DRAFT` must exist.

Invariant behavior:

- enforced in domain
- fail-loud on corruption (`DraftInvariantViolationError`)
- only empty-db bootstrap may create draft (`ensureDraftWorkspace`)

---

# Explicitly Excluded from Milestone 1

- Category modeling
- Item modeling
- Publish pointer flip
- Public read logic
- Authentication
- UI implementation

---

# Closure Evidence

Milestone 1 closure proof is documented in:

- `docs/planning/milestone-1/issues/M1-06-integration-verification-and-milestone-1-proof.md`
