# Milestones

Status: Active. This document defines capability boundaries for the project. Changes to milestone
structure require architectural review and may require a new ADR.

---

Milestones represent capability boundaries.

A milestone answers the question:

What can the system reliably do after this milestone that it could not do before?

A milestone is only complete when:

- The capability is demonstrable end-to-end
- Domain invariants are explicitly enforced
- Architectural layering remains intact
- Documentation reflects the current state
- Decisions are recorded if constraints were introduced

A milestone is not:

- A timebox
- A loose collection of tasks
- A refactor without behavioral impact

Granularity rules:

- Small enough to close confidently
- Large enough to feel meaningful
- Explicit about what it excludes

---

# Milestones (Authoritative Set)

## Milestone 0 — Governance + Technical Skeleton

Capability unlocked: The project can be cloned, installed, migrated, and run consistently with
governance in place.

Closes when:

- Next.js App Router is initialized
- TypeScript and ESLint are configured
- Prisma + SQLite are configured
- Initial migration runs successfully
- Governance documents exist and are coherent
- Branch protection and PR workflow are enforced

Explicitly excludes:

- Any menu domain behavior
- Categories or items
- Public or admin UI behavior
- Authentication

---

## Milestone 1 — Draft Workspace Exists

Capability unlocked: A draft MenuVersion workspace exists and can be retrieved through the domain
layer.

Closes when:

- MenuVersion model exists with DRAFT and PUBLISHED statuses
- Exactly one DRAFT version can be ensured
- Domain can retrieve draft workspace via audience-based read
- No UI required yet

Explicitly excludes:

- Categories
- Items
- Publish flow
- Public read

---

## Milestone 2 — Categories Ordered Within Draft

Capability unlocked: Categories can be created and ordered within the draft workspace.

Closes when:

- Categories belong to a MenuVersion
- Category ordering invariants are enforced (0-based, contiguous, unique per version)
- Create, move up/down, and delete-empty-category operations work in draft
- Ordering corruption results in explicit domain error

Explicitly excludes:

- Items
- Publish flow
- Public read

---

## Milestone 3 — Items Ordered Within Categories

Capability unlocked: Items can be managed within draft categories with proper invariants.

Closes when:

- Items belong to both MenuVersion and Category
- Item ordering invariants are enforced per category
- Item names are unique per category
- priceCents is stored as integer BRL centavos
- hide/unhide toggles isVisible without affecting publish state

Explicitly excludes:

- Publish flow
- Public read
- Authentication

---

## Milestone 4 — Publish and Public Read

Capability unlocked: The menu can be safely published and consumed publicly.

Closes when:

- publishDraft performs pointer flip
- New draft is seeded from published version
- public audience reads from PUBLISHED version only
- adminPreview reads draft using public visibility rules
- Public UI renders only visible content in correct order

Explicitly excludes:

- Authentication
- Advanced preview links
- Version history UI

---

## Milestone 5 — Authentication + Admin Protection

Capability unlocked: Administrative behavior is protected from unauthorized access.

Closes when:

- Admin routes are protected
- Mutation endpoints require authentication
- Public routes remain accessible
- Preview is accessible only to authenticated admin

Explicitly excludes:

- Role management
- Multi-user systems
- Advanced permission models
