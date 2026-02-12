# Architectural Decision Records (ADR)

This file records architectural decisions that introduce constraints or long-term consequences.

> Status: Append-only. Accepted ADRs are not edited.
> Changes require a new ADR that supersedes the prior one.

---

# How to Use This File

A decision must be recorded when:

- Multiple viable alternatives exist
- The choice constrains future work
- Reversal would be costly or disruptive

Every ADR must:

- State a clear decision
- Document context and alternatives
- Declare consequences and follow-ups

All PRs that introduce or rely on an ADR must link to it.

---

# ADR Index

| ADR | Title | Status | Date | Supersedes |
| --- | ----- | ------ | ---- | ---------- |
| ADR-001 | Workspace publishing model (MenuVersion B1) | Accepted | 2026-02-11 | — |
| ADR-002 | Audience-based domain reads | Accepted | 2026-02-11 | — |
| ADR-003 | Ordering model for categories and items | Accepted | 2026-02-11 | — |
| ADR-004 | Money representation (priceCents) | Accepted | 2026-02-11 | — |
| ADR-005 | Item removal is visibility-based | Accepted | 2026-02-11 | — |
| ADR-006 | Minimal authentication boundary in first viable version | Accepted | 2026-02-11 | — |
| ADR-007 | Architecture Stability and Change Control Policy | Accepted | 2026-02-11 | — |

---

# ADR Template

Use this template for new ADRs.

## ADR-XXX — Title

Status: Proposed | Accepted | Superseded
Date: YYYY-MM-DD
Supersedes: ADR-XXX (optional)

### Decision

A short, declarative statement of what was chosen.

### Context

What problem or tension required a decision?

### Options Considered

- Option A
- Option B
- Option C (optional)

### Criteria

What factors determined the choice?

-
-

### Outcome

Why this option won.

### Consequences

What constraints does this introduce?

-
-

### Follow-ups

Concrete work that must occur as a result.

- [ ] 
- [ ] 

(Include only when applicable. Remove this section if no follow-ups are required.)

---

# ADR-001 — Workspace publishing model (MenuVersion B1)

Status: Accepted
Date: 2026-02-11
Supersedes: —

### Decision

Use a MenuVersion workspace model with a single editable DRAFT and a single public PUBLISHED version.

### Context

The system requires safe editing and preview without leaking draft changes to the public menu.
A simple draft/publish model is needed that remains owner-friendly and avoids partial publish states.

### Options Considered

- Row-level draft/publish flags on each entity
- Workspace model with MenuVersion (draft workspace + published workspace)
- Snapshot/version-history model (versioned publishes with rollback)

### Criteria

- Owner-friendly editing workflow
- Minimal conceptual complexity for early development
- Avoidance of data remodel risk
- Clear public vs admin separation

### Outcome

MenuVersion workspaces provide a stable public surface and a safe draft workspace.
Publishing is a pointer flip, not a complex versioning system.

### Consequences

- Entities are scoped to a MenuVersion.
- Domain operations must resolve the correct workspace.
- Publishing must be transactional.


---

# ADR-002 — Audience-based domain reads

Status: Accepted
Date: 2026-02-11
Supersedes: —

### Decision

Domain reads are audience-aware: public reads from PUBLISHED, adminPreview reads from DRAFT using public visibility rules, adminEdit reads from DRAFT including hidden content.

### Context

Preview must render draft data with the same inclusion rules as public without introducing a third lifecycle state.
UI must not embed visibility or lifecycle logic.

### Options Considered

- Separate read functions per route with duplicated filters
- Audience parameter controlling domain read behavior

### Criteria

- Single source of truth for inclusion rules
- Preview fidelity to public rendering
- Minimal duplication across UI and routes

### Outcome

Audience-based reads keep filtering logic centralized and predictable.

### Consequences

- Domain layer owns inclusion filters.
- Route handlers translate but do not decide visibility.


---

# ADR-003 — Ordering model for categories and items

Status: Accepted
Date: 2026-02-11
Supersedes: —

### Decision

Use explicit integer `sortOrder` fields with 0-based, contiguous, unique ordering.
Reordering occurs via stable neighbor swaps through domain operations only.

### Context

Ordering is foundational and easily becomes ambiguous if implicitly encoded in UI behavior or database insertion order.

### Options Considered

- Implicit ordering by creation timestamp
- Explicit `sortOrder` with arbitrary edits
- Explicit `sortOrder` with domain-controlled neighbor swaps

### Criteria

- Deterministic ordering
- Simple, auditable operations
- Strong invariants and corruption detectability

### Outcome

Neighbor swaps preserve uniqueness without temporary collisions and remain easy to reason about.

### Consequences

- Writes affecting ordering must be transactional.
- Corrupted ordering is surfaced as an error, not silently repaired.


---

# ADR-004 — Money representation (priceCents)

Status: Accepted
Date: 2026-02-11
Supersedes: —

### Decision

Store prices as integer BRL centavos (`priceCents`).

### Context

Floating point representations introduce rounding errors and complicate validation.

### Options Considered

- Float/decimal stored as number
- Integer cents stored as Int

### Criteria

- Correctness
- Simplicity
- Consistent formatting

### Outcome

Integer cents provide correct arithmetic and predictable persistence.

### Consequences

- UI must format cents into BRL currency.


---

# ADR-005 — Item removal is visibility-based

Status: Accepted
Date: 2026-02-11
Supersedes: —

### Decision

Removing an item sets `isVisible=false` (soft hide). Items are not hard-deleted in normal operation.

### Context

Owners often want to temporarily remove items without losing configuration.
Hard deletes also increase risk of accidental loss.

### Options Considered

- Hard delete
- Soft delete (deletedAt)
- Visibility-based hide (isVisible)

### Criteria

- Owner-friendly behavior
- Minimal complexity
- Orthogonal to publish state

### Outcome

Visibility-based hide provides the needed behavior with minimal additional concepts.

### Consequences

- Public inclusion requires isVisible=true.
- Admin edit must allow hidden items to be shown.


---

# ADR-006 — Minimal authentication boundary in first viable version

Status: Accepted
Date: 2026-02-11
Supersedes: —

### Decision

Include minimal authentication in the first viable version to protect admin routes, admin preview, and all mutation endpoints.

### Context

Even in single-owner scenarios, accidental exposure of admin endpoints is a high-impact risk.
The system should not rely on deployment assumptions for safety.

### Options Considered

- Defer authentication
- Minimal single-admin authentication (no accounts/roles)
- Full RBAC / multi-user auth

### Criteria

- Risk reduction
- Minimal scope
- No user management burden

### Outcome

Minimal authentication provides practical protection without expanding into accounts or roles.

### Consequences

- Public read remains unauthenticated.
- Auth is a required milestone capability before considering deployment.


---

# ADR-007 — Architecture Stability and Change Control Policy

Status: Accepted
Date: 2026-02-11
Supersedes: —

### Decision

`ARCHITECTURE.md` is considered frozen as of Milestone 0. Any structural change to the system architecture requires a new ADR.

### Context

The architecture document defines system boundaries, invariants, state transitions, layering rules, and publish semantics. Silent modification would erode structural clarity and long-term consistency.

### Options Considered

- Allow direct edits without formal process
- Require lightweight review before edits
- Require formal ADR for structural changes

### Criteria

- Structural stability
- Traceability of architectural evolution
- Protection against informal drift

### Outcome

Requiring an ADR for structural changes ensures architectural evolution remains intentional, reviewable, and historically traceable.

### Consequences

- Structural changes require explicit reasoning and documentation.
- Architectural evolution becomes historically auditable.
- Minor wording clarifications are allowed without ADR if they do not change behavior or invariants.

