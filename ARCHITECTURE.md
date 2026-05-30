# Architecture Reference

> Status: Frozen as of Milestone 0. Changes to this document require an architectural decision
> recorded in `DECISIONS.md`. Last implementation-alignment review: 2026-05-29.

Labareda Menu Manager Architecture

This document describes the structural, behavioral, and dependency model of the system.

It is authoritative for system shape and boundaries.

It does not record decisions (see `DECISIONS.md`). It does not describe milestones (see
`MILESTONES.md`). It does not describe workflow (see execution plan).

---

# 1. System Overview

Labareda Menu Manager is a single-restaurant, full-stack web application.

The system supports:

- Draft editing of menu structure and items
- Safe publishing to a public menu
- Administrative preview
- Strict ordering guarantees
- Minimal authentication protection

The system is intentionally non-distributed and operates as a single application with a single
database.

---

# 1A. Current Implementation Snapshot

As of 2026-05-29, the implemented slice is the draft workspace foundation plus early category domain
and persistence behavior.

Implemented:

- `MenuVersion` schema and status enum (`DRAFT`, `PUBLISHED`, `REPLACED`)
- Domain invariant enforcement for single-draft cardinality
- Domain bootstrap operation (`ensureDraftWorkspace`)
- Domain read operation (`getDraftWorkspace`) for `adminEdit`
- Category schema linked to `MenuVersion`
- Category domain model and repository boundary
- Prisma-backed category repository adapter
- Category ordering invariant enforcement
- Category creation in the draft workspace

Not yet implemented:

- Item domain behavior
- Category update, move, or delete-empty behavior
- Publish flow
- Public read path
- Authentication boundary
- Route handlers for menu operations
- Admin or public menu UI workflows

This section clarifies implementation status only; it does not change architecture policy.

---

# 2. High-Level Architectural Layers

The system follows a strict layered architecture.

```text
UI (App Router Pages + Components)
        |
        v
Route Handlers (HTTP boundary)
        |
        v
Domain Layer (`lib/`)
        |
        v
Persistence Layer (Prisma + Database)
```

Dependency rules:

- UI may depend on Route Handlers and view-focused domain DTOs only when needed
- Route Handlers may depend on Domain
- Domain must not depend on Prisma
- Persistence may depend on Prisma
- No upward dependencies are allowed

Violations are architectural defects.

---

# 2A. Dependency Diagram (Allowed Imports)

This is the canonical dependency graph.

```
+------------------------------+
| UI                           |
|  - app/ pages                |
|  - components/               |
+---------------+--------------+
                |
                v
+---------------+--------------+
| Route Handlers               |
|  - app/api/**/route.ts       |
+---------------+--------------+
                |
                v
+---------------+--------------+
| Domain (lib/)                 |
|  - domain services            |
|  - invariants + validation    |
|  - data access                |
+---------------+--------------+
                |
                v
+---------------+--------------+
| Persistence                   |
|  - prisma client              |
|  - schema + migrations        |
+------------------------------+
```

Import constraints:

- `app/` and UI components must not import Prisma.
- `app/api/**/route.ts` must not import Prisma.
- `app/lib/domain/**` must not import Prisma.
- Prisma imports are restricted to persistence and DB adapter files (`app/lib/persistence/**` and
  `app/lib/db/prisma-client.ts`).

This is enforced by convention and review ritual; violations are treated as architectural defects.

---

# 3. Core Domain Model

## 3.1 MenuVersion (Workspace Model - B1)

MenuVersion represents a workspace.

States:

- DRAFT
- PUBLISHED
- REPLACED

System invariants:

- Exactly one DRAFT exists at all times
- At most one PUBLISHED exists at a time

Behavioral meaning:

- All editing occurs within DRAFT
- Public reads occur from PUBLISHED
- Publishing flips DRAFT to PUBLISHED
- A new DRAFT is seeded from the newly published version

No historical browsing is modeled.

---

## 3.2 Category

Belongs to exactly one MenuVersion.

Implemented fields:

- id
- menuVersionId
- displayName
- position

Target fields not yet implemented:

- description (optional), if retained by future product design
- isVisible, if category visibility remains part of the final public-menu model

Invariants:

- position is 0-based, contiguous, unique per MenuVersion
- displayName is normalized before creation
- displayName is unique per draft MenuVersion for category creation
- Deletion allowed only if category contains no items once items exist

---

## 3.3 Item

Target architecture. Not implemented yet.

Belongs to exactly one Category and one MenuVersion.

Fields (conceptual):

- id
- menuVersionId
- categoryId
- name
- priceCents
- sortOrder
- isVisible

Invariants:

- sortOrder is 0-based, contiguous, unique per Category
- name is unique per Category
- priceCents is integer (BRL centavos)
- Item.menuVersionId must equal Category.menuVersionId

---

# 4. Publish Flow

Target architecture. Not implemented yet.

Publish operation must be atomic.

Steps:

1. Validate invariants (ordering, integrity)
2. Mark current PUBLISHED (if exists) as REPLACED
3. Promote DRAFT to PUBLISHED
4. Create new DRAFT seeded from new PUBLISHED

No partial publish states may be visible externally.

---

# 4A. MenuVersion State Transition Diagram

Target architecture for publish behavior. Only the statuses and draft workspace foundation are
implemented today.

MenuVersion statuses form a simple directed state machine.

Legend:

- Solid arrow: status change
- Dashed arrow: creation

```
           (create)
              |
              v
           +--------+
           | DRAFT  |
           +--------+
              |
              | publish (atomic)
              v
           +----------+
           | PUBLISHED |
           +----------+
              |
              | superseded by next publish
              v
           +----------+
           | REPLACED |
           +----------+

After publish:
- A new DRAFT is created by seeding from the newly PUBLISHED version.
```

State invariants:

- Exactly one DRAFT exists at all times.
- At most one PUBLISHED exists at a time.
- REPLACED versions are not read by normal application flows.

REPLACED exists to preserve referential integrity and auditability without exposing version history.

---

# 5. Audience-Based Domain Reads

Target architecture. Current implementation supports `adminEdit` draft reads only.

Domain read operations are audience-aware.

Audiences:

- public
- adminPreview
- adminEdit

## 5.1 public

- Reads only from PUBLISHED workspace
- Returns only entities where isVisible = true
- Ordering respected
- No draft content leaks

## 5.2 adminPreview

- Reads from DRAFT workspace
- Applies same visibility filters as public
- Uses same rendering components as public

## 5.3 adminEdit

- Reads from DRAFT workspace
- Includes hidden content
- Allows structural manipulation

All visibility filtering logic belongs in the domain layer.

---

# 5A. Request Lifecycle Walkthroughs

This section describes end-to-end request flow across layers. Only the domain-level category
creation flow is implemented today; UI, route handlers, item behavior, publish behavior, and
category movement remain target architecture.

## 5A.1 Current Example: Create Category in Draft Workspace

Goal: Append a category to the DRAFT workspace while preserving category ordering invariants.

Implemented domain flow:

1. Caller
   - Supplies an audience, category repository, menu-version repository, and display name.
   - Does not decide draft lifecycle or ordering rules.

2. Domain
   - Normalizes `displayName` by trimming whitespace.
   - Rejects empty names with `InvalidCategoryDisplayNameError`.
   - Resolves the single draft workspace through `getDraftWorkspace`.
   - Reads existing draft categories through `CategoryRepository.listByMenuVersionId`.
   - Enforces category ordering through `requireContiguousCategoryOrder`.
   - Rejects duplicate normalized display names.
   - Calls `CategoryRepository.createCategory` with the next contiguous `position`.

3. Persistence
   - Stores the requested category and maps the record back to the domain `Category` shape.

## 5A.2 Target Example: Create Item (Admin)

Not implemented yet.

Goal: Create a new item in a category within the DRAFT workspace.

Flow:

1. UI (Admin)
   - Admin submits item form (name, priceCents, categoryId).
   - UI does not implement domain rules.

2. Route Handler
   - Validates transport concerns (required fields, type checks).
   - Calls domain function: `lib/items.createItem(...)`.

3. Domain (lib/)
   - Resolves DRAFT MenuVersion.
   - Validates domain rules:
     - category exists in the DRAFT workspace
     - item name unique within category
     - priceCents is integer >= 0
   - Assigns item sortOrder as append-to-end within category.
   - Performs write in a transaction if ordering is affected.
   - Returns success or explicit domain error.

4. Persistence (Prisma)
   - Executes database operations.

5. Route Handler
   - Maps domain result:
     - success -> 201 JSON
     - domain validation error -> 400
     - not found -> 404
     - invariant/corruption error -> 409 or 500 depending on classification

6. UI
   - Updates UI state.
   - Shows explicit error message if returned.

## 5A.3 Target Example: Publish Draft

Not implemented yet.

Goal: Make the draft menu live and create a fresh draft seeded from it.

Flow:

1. UI (Admin)
   - Admin clicks Publish.

2. Route Handler
   - Confirms authenticated access.
   - Calls domain function: `lib/menu.publishDraft()`.

3. Domain (lib/)
   - Validates invariants:
     - ordering invariants for categories and items
     - referential integrity (items match category MenuVersion)
   - Runs atomic publish transaction:
     - demote current PUBLISHED -> REPLACED (if exists)
     - promote DRAFT -> PUBLISHED
     - create new DRAFT
     - seed new DRAFT with categories/items copied from new PUBLISHED
   - Returns success or explicit domain error.

4. Persistence (Prisma)
   - Executes the transaction.

5. UI
   - Redirects to admin edit view of the new DRAFT.
   - Public menu now reflects the newly published content.

Notes:

- Seeding the new draft is operationally required for owner-friendly editing.
- The system does not expose prior versions through UI; REPLACED is internal.

## 5A.4 Target Example: Move Category Up (Ordering Swap)

Not implemented yet.

Goal: Move a category up by one position within the DRAFT workspace while preserving ordering
invariants.

Flow:

1. UI (Admin)
   - Admin clicks "Move up" on a category.

2. Route Handler
   - Validates transport concerns (categoryId present).
   - Calls domain function: `lib/categories.moveUp({ categoryId })`.

3. Domain (lib/)
   - Resolves DRAFT MenuVersion.
   - Loads the target category and its neighbor (`position - 1`) within the same MenuVersion.
   - Applies rules:
     - If category is already at the top boundary, operation is a no-op.
     - Otherwise, swap `position` with the immediate neighbor.
   - Performs swap atomically in a single transaction.
   - Ensures postconditions:
     - `position` values remain contiguous, unique, and cover 0..N-1.
   - Returns success or explicit corruption/invariant error.

4. Persistence (Prisma)
   - Updates the two affected rows within the transaction.

5. Route Handler
   - Maps domain result:
     - success -> 200
     - not found -> 404
     - corrupted ordering -> 409

6. UI
   - Re-renders list using the returned ordering.
   - No special-case UI ordering logic is allowed.

---

# 5B. Error Taxonomy and HTTP Mapping

Target architecture for route handlers and transport mapping. Current implementation has a
domain-owned `DomainError` base class plus concrete domain errors; HTTP mapping is not implemented
yet.

The system distinguishes error classes to keep behavior predictable and debuggable.

## 5B.1 Domain Error Classes

Current implemented domain errors:

- `DraftInvariantViolationError`
- `UnsupportedAudienceError`
- `CategoryOrderingInvariantViolationError`
- `InvalidCategoryDisplayNameError`

The classes below are target transport classifications, not current class names.

### ValidationError

Used when user-provided input is structurally valid at the transport layer, but violates domain
rules.

Examples:

- Duplicate item name within a category
- priceCents < 0
- Attempt to delete a non-empty category

### NotFoundError

Used when an entity does not exist in the expected workspace.

Examples:

- categoryId does not exist in the DRAFT workspace
- itemId does not exist in the DRAFT workspace

### ConflictError

Used when state is valid but an operation cannot be applied due to concurrency or a competing
constraint.

Examples:

- Attempt to publish when no DRAFT exists
- Attempt to create a second DRAFT workspace

### CorruptionError

Used when required invariants appear broken, indicating corrupted state.

Examples:

- sortOrder gaps or duplicates
- Item.menuVersionId does not match Category.menuVersionId

Corruption is not silently repaired; it is surfaced.

### AuthError

Used when an authenticated boundary is accessed without valid credentials.

Examples:

- unauthenticated access to admin preview
- unauthenticated mutation calls

### UnexpectedError

Used when an unanticipated failure occurs.

Examples:

- database connectivity failures
- unhandled exceptions

## 5B.2 Recommended HTTP Mapping

Route handlers translate domain errors into HTTP responses.

- ValidationError -> 400
- NotFoundError -> 404
- ConflictError -> 409
- CorruptionError -> 409 (or 500 if treating as internal fault; choose one policy and keep it
  consistent)
- AuthError -> 401 (or 403 depending on auth mechanism)
- UnexpectedError -> 500

## 5B.3 Error Payload Contract (Transport)

Errors returned by route handlers should be machine- and human-readable.

Recommended minimal shape:

- `code` (stable string identifier)
- `message` (human-readable)
- `details` (optional structured context)

The UI should render `message` directly and avoid interpreting error causes beyond `code`.

---

## 5B.4 Reserved Error Code Appendix

This appendix defines target transport error codes. These are not all implemented yet, and they must
be reconciled with current domain codes before route handlers expose them as an HTTP contract.

Current implemented domain codes:

- `DRAFT_INVARIANT_VIOLATION`
- `UNSUPPORTED_AUDIENCE`
- `ORDERING_INVARIANT_VIOLATION`
- `INVALID_CATEGORY_DISPLAY_NAME`

### Category Errors

- `CATEGORY_NOT_FOUND`
- `CATEGORY_NOT_EMPTY`
- `CATEGORY_NAME_DUPLICATE`
- `CATEGORY_ORDERING_CORRUPTED`
- `CATEGORY_ALREADY_AT_TOP`
- `CATEGORY_ALREADY_AT_BOTTOM`

### Item Errors

- `ITEM_NOT_FOUND`
- `ITEM_NAME_DUPLICATE`
- `ITEM_PRICE_INVALID`
- `ITEM_ORDERING_CORRUPTED`
- `ITEM_VERSION_MISMATCH`
- `ITEM_ALREADY_AT_TOP`
- `ITEM_ALREADY_AT_BOTTOM`

### Workspace / Publish Errors

- `DRAFT_NOT_FOUND`
- `PUBLISHED_NOT_FOUND`
- `MULTIPLE_DRAFTS_DETECTED`
- `MULTIPLE_PUBLISHED_DETECTED`
- `PUBLISH_INVARIANT_VIOLATION`
- `WORKSPACE_SEED_FAILED`

### Visibility Errors

- `VISIBILITY_INVALID_STATE`

### Authentication Errors

- `AUTH_REQUIRED`
- `AUTH_INVALID`

### Generic System Errors

- `INVARIANT_VIOLATION`
- `ORDERING_CORRUPTED`
- `UNEXPECTED_ERROR`

Guidelines:

- Error codes are UPPER_SNAKE_CASE.
- Codes are stable identifiers; messages may evolve.
- Codes must be defined in a centralized location in the domain layer.
- New codes require architectural review if they reflect new invariants.

---

# 6. Ordering Model

Ordering is explicit and deterministic.

Categories:

- position per MenuVersion
- Modified only via domain operations
- Current implementation validates 0-based, contiguous, unique category positions and appends new
  draft categories at the next position.

Items:

- sortOrder per Category
- Modified only via domain operations
- Target architecture. Not implemented yet.

Ordering changes must be atomic.

Corrupted ordering (gaps or duplicates) results in domain error.

---

# 7. Visibility Model

Target architecture. Not implemented yet.

Visibility and publish state are orthogonal.

- status determines workspace exposure
- isVisible determines display inclusion

Entities may be published but hidden.

Public display rule:

- Category visible AND Item visible required

---

# 8. Authentication Boundary

Target architecture. Not implemented yet.

Authentication protects:

- All admin routes
- All mutation endpoints
- Admin preview

Public read endpoints remain unauthenticated.

Authentication is minimal and does not model roles or multi-user behavior.

---

# 9. Data Integrity and Transactions

Target architecture for mutation flows that can expose intermediate invalid states. Current category
creation relies on domain ordering validation and the database uniqueness constraint, but the
broader transaction policy is not fully implemented yet.

Operations that modify:

- Ordering
- Publish state
- Draft seeding

Must execute within database transactions.

Intermediate invalid states must never be externally observable.

---

# 10. Explicit Non-Modeled Concerns

The system intentionally does not model:

- Multi-restaurant tenancy
- Version history browsing
- Scheduled publishing
- Partial publish flows
- External integrations
- Distributed consistency

Future expansion into these areas requires explicit architectural decision.

---

# 11. Architectural Stability Rules

The following changes require decision recording:

- Workspace model changes
- Publish semantics changes
- Layer dependency changes
- Ordering model changes
- Authentication boundary changes

Structural ambiguity is treated as architectural debt.
