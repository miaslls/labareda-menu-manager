# Roadmap

Status: Active execution phase.

This document defines the ordered progression of capability delivery. It translates milestone
definitions into execution sequence and current focus.

Milestones define capability boundaries. This roadmap defines progression and execution order.

---

# Roadmap Principles

- Execution follows milestone order strictly.
- No milestone work begins before the previous milestone is closed.
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

## Phase 0 — Foundation Freeze (Complete)

Completed during planning phase prior to repository creation.

Includes:

- Architecture defined and frozen
- ADRs recorded
- Milestones defined
- Governance model defined

---

## Phase 1 — Repository Initialization (Complete)

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

## Milestone 0 — Governance + Technical Skeleton (Complete)

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

## Milestone 1 — Draft Workspace Exists

Objective: Introduce MenuVersion workspace model.

Focus Areas:

- Schema for MenuVersion
- Ensure single DRAFT invariant
- Domain read for draft workspace

Deliverable:

- Draft workspace retrievable via domain layer

---

## Milestone 2 — Categories in Draft

Objective: Enable category management with strict ordering.

Focus Areas:

- Category model
- Ordering invariants
- Create / move / delete-empty operations

Deliverable:

- Categories manageable within draft workspace

---

## Milestone 3 — Items in Draft

Objective: Enable item management within categories.

Focus Areas:

- Item model
- Ordering invariants per category
- priceCents validation
- Visibility toggling

Deliverable:

- Full draft menu structure editable

---

## Milestone 4 — Publish + Public Read

Objective: Enable safe publish and public consumption.

Focus Areas:

- publishDraft pointer flip
- Seed new draft
- Public read from PUBLISHED workspace
- Admin preview behavior

Deliverable:

- Public menu reflects published workspace

---

## Milestone 5 — Authentication

Objective: Protect administrative surfaces.

Focus Areas:

- Protect admin routes
- Protect mutation endpoints
- Protect preview

Deliverable:

- Admin access restricted

---

# Current Focus

Current Milestone: Milestone 1 — Draft Workspace Exists

Next Action:

- Define MenuVersion schema
- Introduce domain invariant: exactly one DRAFT
- Implement audience-based draft read

---

# Out of Scope

- Multi-user authentication
- Version history browsing
- Scheduled publishing
- Multi-restaurant support
- Inventory tracking
- Online ordering

Future expansion requires ADR and roadmap revision.
