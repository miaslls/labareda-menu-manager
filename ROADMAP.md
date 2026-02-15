# Roadmap

Status: Active planning phase (Pre-Repository Initialization)

This document defines the ordered progression of capability delivery. It translates milestone
definitions into execution sequence and focus.

Milestones define capability boundaries. This roadmap defines progression and current focus.

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
- ADRs recorded (ADR-001 through ADR-007)
- Milestones defined
- Governance model defined

---

## Phase 1 — Repository Initialization

Objective: Create the repository and establish governance infrastructure.

Includes:

- Create GitHub repository
- Configure branch protection
- Add governance documents
- Configure issue and PR templates
- Create milestone structure in GitHub

Exit Criteria:

- Repository cloneable
- Governance files committed
- PR workflow enforced

---

## Milestone 0 — Governance + Technical Skeleton

Objective: Establish working technical foundation.

Focus Areas:

- Next.js initialization
- TypeScript + ESLint
- Prisma setup
- Initial migration

Deliverable: Application boots locally with empty schema.

---

## Milestone 1 — Draft Workspace Exists

Objective: Introduce MenuVersion workspace model.

Focus Areas:

- Schema for MenuVersion
- Ensure single DRAFT invariant
- Domain read for draft workspace

Deliverable: Draft workspace retrievable via domain.

---

## Milestone 2 — Categories in Draft

Objective: Enable category management with strict ordering.

Focus Areas:

- Category model
- Ordering invariants
- Create / move / delete-empty operations

Deliverable: Categories manageable within draft workspace.

---

## Milestone 3 — Items in Draft

Objective: Enable item management within categories.

Focus Areas:

- Item model
- Ordering invariants per category
- priceCents validation
- Visibility toggling

Deliverable: Full draft menu structure editable.

---

## Milestone 4 — Publish + Public Read

Objective: Enable safe publish and public consumption.

Focus Areas:

- publishDraft pointer flip
- Seed new draft
- Public read from PUBLISHED workspace
- Admin preview behavior

Deliverable: Public menu reflects published workspace.

---

## Milestone 5 — Authentication

Objective: Protect administrative surfaces.

Focus Areas:

- Protect admin routes
- Protect mutation endpoints
- Protect preview

Deliverable: Admin access restricted.

---

# Current Focus

Current Phase: Pre-repository governance completion.

Next Action: Draft Phase 1 and Milestone 0 issues before repository creation.

---

# Initial Issue Draft (Pre-Repository Planning)

The following issues will be created once the repository exists. These represent the first
executable wave of work.

## Phase 1 — Repository Initialization Issues

---

### Issue: Add foundational governance documents

Type: Documentation Milestone: Phase 1 — Repository Initialization

**Problem** Repository must contain all authoritative governance and architecture documents before
technical work begins.

**Scope**

- Add README.md
- Add ARCHITECTURE.md
- Add MILESTONES.md
- Add DECISIONS.md
- Add ROADMAP.md

**Acceptance Criteria**

- All documents committed to `main` via PR
- Cross-references verified
- Architecture marked frozen

---

### Issue: Configure branch protection and PR requirements

Type: Governance Milestone: Phase 1 — Repository Initialization

**Problem** `main` must be protected to enforce disciplined workflow.

**Scope**

- Protect `main`
- Require pull request for merge
- Disable direct pushes

**Acceptance Criteria**

- Direct push to `main` blocked
- PR required for merge

---

### Issue: Add issue and PR templates

Type: Governance Milestone: Phase 1 — Repository Initialization

**Problem** Standardized issue and PR structure is required for consistency.

**Scope**

- Issue template
- Decision template
- Spike template
- PR template (with Layer Check)

**Acceptance Criteria**

- Templates appear in GitHub UI
- PR template auto-populates on new PR

---

### Issue: Create canonical labels and milestone structure

Type: Governance Milestone: Phase 1 — Repository Initialization

**Problem** Issues must be classifiable and trackable by milestone.

**Scope**

- Add canonical label set
- Create Milestones 0–5

**Acceptance Criteria**

- Labels visible in repository
- Milestones selectable when creating issues

---

## Milestone 0 — Governance + Technical Skeleton Issues

---

### Issue: Initialize Next.js App Router skeleton

Type: Feature Milestone: Milestone 0 — Governance + Technical Skeleton

**Problem** Project requires a working application skeleton before domain work begins.

**Scope**

- Create Next.js App Router project
- Verify dev server boots

**Acceptance Criteria**

- `npm run dev` starts successfully
- Default page renders without error

---

### Issue: Configure TypeScript and ESLint

Type: Feature Milestone: Milestone 0 — Governance + Technical Skeleton

**Problem** Strict typing and linting are required for architectural discipline.

**Scope**

- Enable strict TypeScript mode
- Configure ESLint

**Acceptance Criteria**

- TypeScript compiles with no errors
- Lint script runs successfully

---

### Issue: Integrate Prisma with SQLite

Type: Feature Milestone: Milestone 0 — Governance + Technical Skeleton

**Problem** Persistence layer must be initialized before domain modeling.

**Scope**

- Install Prisma
- Initialize schema
- Configure SQLite

**Acceptance Criteria**

- Prisma client generates successfully
- Database file created locally

---

### Issue: Run initial migration

Type: Feature Milestone: Milestone 0 — Governance + Technical Skeleton

**Problem** Migration pipeline must be verified early.

**Scope**

- Create initial migration
- Verify reset works

**Acceptance Criteria**

- Migration applies successfully
- `prisma migrate reset` succeeds

---

### Issue: Finalize setup instructions in README

Type: Documentation Milestone: Milestone 0 — Governance + Technical Skeleton

**Problem** Project must be reproducible from clean clone.

**Scope**

- Document clone → install → migrate → run

**Acceptance Criteria**

- Fresh clone boots successfully following README
- No undocumented setup steps required

Exit Condition for Issue Wave: All Milestone 0 issues closed and application boots locally from
clean clone.

---

# Out of Scope for Initial Roadmap

- Multi-user authentication
- Version history browsing
- Scheduled publishing
- Multi-restaurant support
- Inventory tracking
- Online ordering

Future expansion requires ADR and roadmap revision.
