# Milestone 1 — Issue Map

Status: Planning artifact. Purpose: Define the complete issue sequence required to close Milestone 1
— Draft Workspace Exists.

This document translates the Milestone 1 capability boundary into concrete, atomic issues. Each
issue unlocks a specific, verifiable behavioral step.

Milestone Capability Target:

The domain layer can reliably retrieve the draft MenuVersion workspace with the invariant: exactly
one DRAFT exists.

---

# Issue Sequence Overview

Milestone 1 will be executed in tightly scoped steps. No UI. No publish flow. No category or item
modeling.

Each issue introduces one controlled change.

---

# Naming and Placement Conventions (Milestone 1)

Purpose: Reduce cognitive overhead by making file locations predictable.

## Domain layer (`lib/`)

- Domain types live in `app/lib/domain/**`
  - Example: `app/lib/domain/menu-version/MenuVersion.ts`
- Domain errors live alongside the concept they protect
  - Example: `app/lib/domain/menu-version/errors.ts`
- Domain operations (use-cases) live in `app/lib/domain/menu-version/ops/**`
  - Example: `app/lib/domain/menu-version/ops/getDraftWorkspace.ts`

## Repository contracts (domain boundary)

- Repository interfaces live in `app/lib/domain/**/repositories/**`
  - Example: `app/lib/domain/menu-version/repositories/MenuVersionRepository.ts`

## Infrastructure / persistence adapters

- Prisma-backed implementations live in `app/lib/persistence/**`
  - Example: `app/lib/persistence/menu-version/prismaMenuVersionRepository.ts`
- Mapping between Prisma records and domain entities must be isolated to adapters.

## Routes and UI

- No new route handlers or UI are required for Milestone 1.
- If a script is needed for verification, place it under `scripts/` and keep it copy/paste friendly.

## Testing

- Unit tests live in `app/lib/**/__tests__/**` near the code under test.
- Milestone 1 tests must remain DB-free (pure domain tests).

## Conventions

- Filenames use `kebab-case` for folders, `PascalCase` for exported types, and `camelCase` for
  functions.
- No Prisma imports in domain files.

---

## M1-01 — Introduce MenuVersion Schema

Type: Feature  
Area: schema

Problem  
The system currently has no MenuVersion model.

Scope

- Add MenuVersion model to Prisma schema
- Define fields: id, status, timestamps
- Define status enum: DRAFT, PUBLISHED, REPLACED
- Generate migration

Execution Subtasks (internal checkpoints)

- M1-01A — Define schema shape
  - Add `MenuVersion` model
  - Add `MenuVersionStatus` enum
  - Confirm timestamp strategy (createdAt/updatedAt)

- M1-01B — Migration + toolchain verification
  - Generate migration
  - Run `db:validate`, `db:generate`, `db:migrate`, `db:reset`
  - Confirm no tracked artifacts change unexpectedly

Acceptance Criteria

- Migration runs successfully
- Prisma client generates
- Schema compiles with no type errors

Out of Scope

- Invariant enforcement
- Seeding logic
- Domain logic

---

## M1-02 — Introduce Domain Model for MenuVersion

Type: Feature  
Area: lib

Problem  
Persistence exists but domain layer does not model MenuVersion.

Scope

- Create domain representation for MenuVersion
- Define status type at domain boundary
- Create repository abstraction for MenuVersion reads

Execution Subtasks (internal checkpoints)

- M1-02A — Define domain status type
  - Define `MenuVersionStatus` in domain
  - Add explicit mapping from persistence status → domain status
  - Ensure no Prisma types leak into `lib/`

- M1-02B — Define domain entity shape
  - Define domain `MenuVersion` type/interface
  - Include only fields needed for Milestone 1
  - Keep persistence details out of domain types

- M1-02C — Define repository contract (domain boundary)
  - Define `MenuVersionRepository` interface in domain
  - Include minimal read operations required for Milestone 1
  - No Prisma usage in domain

- M1-02D — Implement repository adapter (Prisma-backed)
  - Implement repository in infrastructure/persistence layer
  - Map Prisma records → domain entities
  - Keep mapping logic isolated to the adapter

Acceptance Criteria

- Domain types compile
- No persistence logic leaks into domain
- Layer boundaries respected

Out of Scope

- Invariant enforcement
- Draft creation logic

---

## M1-02.5 — Introduce Testing Harness (Vitest)

Type: Governance  
Area: tooling

Problem  
Milestone 1 will introduce domain invariants. We need a deterministic, fast feedback loop before
implementing invariant logic.

Scope

- Install Vitest
- Configure minimal TypeScript-compatible test setup
- Add `test` and `test:watch` scripts
- Add one trivial sanity test proving the harness runs

Execution Subtasks (internal checkpoints)

- M1-02.5A — Add tooling
  - Add Vitest dependency
  - Add scripts: `test`, `test:watch`

- M1-02.5B — Minimal config
  - Choose a minimal configuration compatible with repo module system
  - Keep config localized and documented

- M1-02.5C — Sanity test
  - Add one trivial passing test (no DB)
  - Confirm `npm run test` and `npm run test:watch` behave as expected

Acceptance Criteria

- `npm run test` executes successfully
- Test environment runs without Prisma or DB dependency
- One trivial passing test exists

Out of Scope

- Repository adapter integration tests
- Database integration tests
- UI tests

---

## M1-03 — Enforce Single DRAFT Invariant

Type: Feature  
Area: lib

Problem  
Milestone requires exactly one DRAFT at all times.

Scope

- Implement domain function ensuring single DRAFT
- Fail loudly if 0 or >1 DRAFT versions exist
- Define explicit domain error for invariant violation
- Add domain unit tests proving the failure modes

Execution Subtasks (internal checkpoints)

- M1-03A — Error modeling
  - Define a specific domain error type for draft invariant violations
  - Include compact, debuggable payload (counts, ids if available)

- M1-03B — Invariant function
  - Implement invariant checker that accepts a collection of MenuVersions
  - Return the single DRAFT when valid
  - Throw domain error when invalid

- M1-03C — Tests
  - Test: exactly one DRAFT → returns it
  - Test: zero DRAFT → throws expected error
  - Test: two+ DRAFT → throws expected error

Acceptance Criteria

- Invariant enforced at domain layer
- Corruption produces deterministic error
- No silent repair
- Tests cover success + both failure modes

Out of Scope

- Auto-healing
- Publish flow

---

## M1-04 — Implement Audience-Based Draft Read

Type: Feature  
Area: lib

Problem  
Milestone requires domain-level retrieval of draft workspace via audience-aware read.

Scope

- Implement `getDraftWorkspace(audience)`
- Ensure audience parameter is explicit
- Draft read for `adminEdit` returns the DRAFT workspace

Execution Subtasks (internal checkpoints)

- M1-04A — Audience model
  - Define/confirm audience type (`public`, `adminPreview`, `adminEdit`)
  - Ensure domain API requires explicit audience argument

- M1-04B — Read path implementation
  - Use repository abstraction to fetch versions
  - Apply single-DRAFT invariant checker
  - Return draft deterministically

Acceptance Criteria

- Draft retrievable via domain call
- No UI dependency
- No route handler coupling

Out of Scope

- Public read logic
- Publish logic

---

## M1-05 — Seed Initial Draft if None Exists

Type: Feature  
Area: lib + schema

Problem  
System must guarantee at least one DRAFT exists.

Scope

- Introduce controlled draft creation path
- Ensure draft is created if database is empty
- Ensure idempotency
- Keep creation rules inside domain

Execution Subtasks (internal checkpoints)

- M1-05A — Define domain operation
  - Define `ensureDraftWorkspace()`
  - Return existing DRAFT if present
  - Create one if none exist

- M1-05B — Extend repository for write capability
  - Add minimal create method
  - Implement in Prisma adapter
  - Use transaction if applicable

- M1-05C — Idempotency proof
  - Fresh DB → one DRAFT created
  - Repeated calls → no duplicates

Acceptance Criteria

- Fresh database produces exactly one DRAFT
- Re-running does not create duplicates
- Invariant preserved

Out of Scope

- Categories
- Items

---

## M1-06 — Integration Verification Slice

Type: Documentation / Verification  
Area: governance

Problem  
Milestone closure requires demonstrable proof.

Scope

- Document verification steps
- Confirm invariant enforcement via tests
- Confirm deterministic behavior from clean DB

Execution Subtasks (internal checkpoints)

- M1-06A — Test proof
  - All invariant tests pass

- M1-06B — Clean DB proof
  - Reset DB
  - Run ensureDraftWorkspace
  - Confirm exactly one DRAFT

- M1-06C — Copy/paste verification steps
  - Provide minimal reproducible command sequence

Acceptance Criteria

- Demonstrable proof artifact
- No hidden steps
- Milestone closure checklist satisfied

Out of Scope

- UI exposure
- Admin interface

---

# Invariant Introduced in Milestone 1

Exactly one MenuVersion with status DRAFT must exist at all times.

This invariant must:

- Be enforced in the domain layer
- Fail loudly on corruption
- Not be enforced in the persistence layer

---

# Explicitly Excluded from Milestone 1

- Category modeling
- Item modeling
- Publish pointer flip
- Public read logic
- Authentication
- UI implementation

---

# Closure Condition

Milestone 1 is complete when:

- Schema contains MenuVersion
- Domain enforces single DRAFT invariant
- Draft workspace can be retrieved deterministically
- Clean database produces exactly one DRAFT
- All verification steps documented
