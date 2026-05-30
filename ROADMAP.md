# Roadmap

Status: Active execution phase. Last reviewed: 2026-05-29.

This document defines the ordered progression of capability delivery. It translates milestone
definitions into execution sequence and current focus.

Milestones define capability boundaries. This roadmap defines progression and execution order.

---

# Roadmap Principles

- Execution follows milestone order for product capabilities.
- No product capability work begins before its prerequisite milestone is closed.
- Cross-cutting hardening may be inserted when implementation review exposes an unresolved invariant
  or accepted ADR follow-up.
- Architectural stability takes precedence over speed.
- Scope expansion requires an ADR.

---

# Execution Philosophy

- Milestones are capability-driven, not time-driven.
- No deadline commitments are attached to milestones.
- Progress is measured by invariant enforcement and architectural integrity.
- Architectural clarity is valued over delivery velocity.

---

# Execution Sequence

## Phase 0 - Foundation Freeze (Complete)

Completed during planning phase prior to repository creation.

Includes:

- Architecture defined and frozen
- ADRs recorded
- Milestones defined
- Governance model defined

---

## Phase 1 - Repository Initialization (Complete)

Objective: Create the repository and establish governance infrastructure.

Includes:

- GitHub repository creation
- Branch protection configured
- Governance documents committed
- Issue and PR templates added
- Milestones created in GitHub

Exit Criteria (Satisfied):

- Repository cloneable
- Governance files committed
- PR workflow enforced

---

## Milestone 0 - Governance + Technical Skeleton (Complete)

Objective: Establish working technical foundation.

Focus Areas:

- Next.js initialization
- TypeScript + ESLint
- Prisma setup
- Initial migration
- Verified reset pipeline
- Clean-clone setup documentation

Deliverable (Satisfied):

- Application boots locally
- Migration pipeline deterministic
- Governance enforced
- Setup reproducible from clean clone

---

## Milestone 1 - Draft Workspace Exists (Complete on 2026-03-18)

Objective: Introduce MenuVersion workspace model.

Focus Areas:

- Schema for MenuVersion
- Ensure single DRAFT invariant
- Domain read for draft workspace
- Deterministic empty-db bootstrap via `ensureDraftWorkspace`

Deliverable (Satisfied):

- Draft workspace retrievable via domain layer
- Proof artifact available at
  `docs/planning/milestone-1/issues/M1-06-integration-verification-and-milestone-1-proof.md`

---

## Milestone 2 - Categories in Draft

Status: Active.

Objective: Enable category management with strict ordering.

Focus Areas:

- Category model
- Ordering invariants
- Create / move / delete-empty operations

Implemented so far:

- Category schema linked to `MenuVersion`
- Category domain model and repository boundary
- Prisma-backed category repository adapter
- Category ordering invariant checker
- Draft category creation operation

Remaining core work:

- Move category up/down within draft workspace
- Delete empty category and close ordering gap
- Milestone 2 proof artifact

Deferred hardening:

- Concurrent category append protection
- Category creation postcondition checks

Deliverable:

- Categories manageable within draft workspace

---

## Milestone 3 - Items in Draft

Objective: Enable item management within categories.

Focus Areas:

- Item model
- Ordering invariants per category
- priceCents validation
- Visibility toggling

Deliverable:

- Full draft menu structure editable

---

## Milestone 4 - Publish + Public Read

Objective: Enable safe publish and public consumption.

Focus Areas:

- publishDraft pointer flip
- Seed new draft
- Public read from PUBLISHED workspace
- Admin preview behavior

Deliverable:

- Public menu reflects published workspace

---

## Milestone 5 - Authentication

Objective: Protect administrative surfaces.

Focus Areas:

- Protect admin routes
- Protect mutation endpoints
- Protect preview

Deliverable:

- Admin access restricted

---

# Current Focus

Current Milestone: Milestone 2 - Categories in Draft

Current implementation state:

- M2-01 through M2-04 are implemented.
- M2-05 through M2-07 remain open.
- ADR-011 records a Postgres singleton-DRAFT enforcement decision that must be implemented before
  relying on the draft workspace invariant for broader mutation flows.

Next Actions:

1. Implement ADR-011 follow-ups:
   - add Postgres partial unique index for singleton DRAFT
   - add repository create-conflict readback
   - verify deterministic bootstrap behavior
2. Continue Milestone 2 core work with M2-05:
   - move category up/down within draft workspace
   - preserve 0-based, contiguous, unique category positions
   - fail loudly on corrupted ordering

---

# Out of Scope

- Multi-user authentication
- Version history browsing
- Scheduled publishing
- Multi-restaurant support
- Inventory tracking
- Online ordering

Future expansion requires ADR and roadmap revision.
