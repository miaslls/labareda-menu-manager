# Labareda Menu Manager

Labareda Menu Manager is a single-restaurant menu management system built as a full-stack web application using Next.js and Prisma.

The system is intentionally designed and governed as if developed by a small professional engineering team. Architectural clarity, explicit invariants, and disciplined workflow are first-class concerns.

---

# Purpose

The system solves two primary problems:

1. Operational

   * The restaurant owner must be able to update categories, items, and prices without technical assistance.
   * Changes may be seasonal or on-demand.

2. Educational

   * The project serves as a structured learning artifact.
   * Architecture, governance, and professional workflow practices are deliberately emphasized.

Clarity and correctness are prioritized over speed or early generalization.

---

# System Characteristics

* Single-restaurant scope (not multi-tenant)
* Unified frontend and backend (Next.js App Router)
* Prisma ORM with relational database
* Explicit architectural layering
* Strict milestone-based capability evolution

---

# Core Architectural Model

## Workspace Model (B1)

The system uses a workspace-based publishing model.

There are always:

* Exactly one `DRAFT` menu version
* Exactly one `PUBLISHED` menu version (after first publish)

All editing occurs in the draft workspace.

Publishing performs:

* A pointer flip (draft becomes published)
* Creation of a new draft seeded from the newly published version

No historical version browsing or rollback UI is provided.

---

## Lifecycle

MenuVersion status:

* `DRAFT`
* `PUBLISHED`
* `REPLACED` (internal archival state)

Preview is not a lifecycle state.

Admin users may access a "View as public" preview that renders the draft workspace using public visibility rules.

---

## Visibility vs Publish

Visibility and publish state are independent.

* `status` determines which workspace is public.
* `isVisible` determines whether a category or item is shown.

An item may be published but hidden.

---

## Domain Read Context

Domain reads are audience-aware.

Possible audiences:

* `public`
* `adminPreview`
* `adminEdit`

Public reads operate only on the published workspace.
Admin preview renders draft data using public visibility filters.
Admin edit operates on the draft workspace and includes hidden content.

---

# Money Handling

Item prices are stored as integers in BRL centavos (`priceCents`).

Formatting is performed at the UI boundary.

---

# Architectural Boundaries

The system enforces strict layering:

UI → Route Handlers → Domain (`lib/`) → Persistence (Prisma)

Business rules and invariants exist only in the domain layer.

Persistence does not contain business logic.

---

# Governance

This project operates under a disciplined workflow:

* Protected `main` branch
* One branch per issue
* All changes via pull request
* Architecture defined and frozen in `ARCHITECTURE.md`
* Functional boundaries defined in `SCOPE.md`
* Architectural decisions recorded in `DECISIONS.md`
* Milestones define capability boundaries (`MILESTONES.md`)
* Roadmap defines execution order (`ROADMAP.md`)
* Documentation is updated alongside behavior

---

# Setup (Milestone 0 Target)

These instructions will be finalized once Milestone 0 is complete.

Expected flow:

1. Clone repository
2. Install dependencies
3. Configure environment variables
4. Run Prisma migrations
5. Start development server

---

# Non-Goals

* Multi-restaurant support
* SaaS platform capabilities
* Online ordering or payment workflows
* Role-based access control
* Inventory management
* External system integrations

Scope changes require explicit architectural decisions.

---

# Status

The project is currently in governance and planning phase prior to repository initialization.
