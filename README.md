# Labareda Menu Manager

Last updated: 2026-03-18  
Current package version: `0.2.0`

Labareda Menu Manager is a single-restaurant menu management system built as a full-stack web
application using Next.js and Prisma.

The system is intentionally designed and governed as if developed by a small professional
engineering team. Architectural clarity, explicit invariants, and disciplined workflow are
first-class concerns.

---

## Current Capability (Implemented)

Milestone 1 is complete.

The system can now reliably:

- bootstrap an initial `DRAFT` `MenuVersion` when the repository is empty
- enforce the invariant "exactly one `DRAFT` exists" in the domain layer
- retrieve the draft workspace for `adminEdit` audience deterministically
- fail loudly on corruption through domain errors (`DRAFT_INVARIANT_VIOLATION`)

Implemented domain operations:

- `ensureDraftWorkspace(repo)`
- `getDraftWorkspace(audience, repo)`
- `requireSingleDraftMenuVersion(versions)`

Implemented proof workflow:

- `npm run proof:m1`
- `scripts/proof-m1.integration.test.ts`

---

# Purpose

The system solves two primary problems:

1. Operational
   - The restaurant owner must be able to update categories, items, and prices without technical
     assistance.
   - Changes may be seasonal or on-demand.

2. Educational
   - The project serves as a structured learning artifact.
   - Architecture, governance, and professional workflow practices are deliberately emphasized.

Clarity and correctness are prioritized over speed or early generalization.

---

# System Characteristics

- Single-restaurant scope (not multi-tenant)
- Unified frontend and backend (Next.js App Router)
- Prisma ORM with Neon Postgres
- Explicit architectural layering
- Strict milestone-based capability evolution

---

# Core Architectural Model

## Workspace Model (B1)

The system uses a workspace-based publishing model.

There are always:

- Exactly one `DRAFT` menu version
- Exactly one `PUBLISHED` menu version (after first publish)

All editing occurs in the draft workspace.

Publishing performs:

- A pointer flip (draft becomes published)
- Creation of a new draft seeded from the newly published version

No historical version browsing or rollback UI is provided.

---

## Lifecycle

MenuVersion status:

- `DRAFT`
- `PUBLISHED`
- `REPLACED` (internal archival state)

Preview is not a lifecycle state.

Admin users may access a "View as public" preview that renders the draft workspace using public
visibility rules.

---

## Visibility vs Publish

Visibility and publish state are independent.

- `status` determines which workspace is public.
- `isVisible` determines whether a category or item is shown.

An item may be published but hidden.

---

## Domain Read Context

Domain reads are audience-aware.

Possible audiences:

- `public`
- `adminPreview`
- `adminEdit`

Public reads operate only on the published workspace. Admin preview renders draft data using public
visibility filters. Admin edit operates on the draft workspace and includes hidden content.

---

# Money Handling

Item prices are stored as integers in BRL centavos (`priceCents`).

Formatting is performed at the UI boundary.

---

# Architectural Boundaries

The system enforces strict layering:

`UI -> Route Handlers -> Domain -> Persistence`

Business rules and invariants exist only in the domain layer.

Persistence does not contain business logic.

---

# Governance

This project operates under a disciplined workflow:

- Protected `main` branch
- One branch per issue
- All changes via pull request
- Architecture defined and frozen in `ARCHITECTURE.md`
- Functional boundaries defined in `SCOPE.md`
- Architectural decisions recorded in `DECISIONS.md`
- Milestones define capability boundaries (`MILESTONES.md`)
- Roadmap defines execution order (`ROADMAP.md`)
- Documentation is updated alongside behavior

---

# Setup

The repository is reproducible from a clean clone.

## Prerequisites

- Node.js (LTS recommended)
- npm (ships with Node)

## Local Setup

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd labareda-menu-manager
   ```

2. Install dependencies

   ```bash
   npm ci
   ```

3. Create a local environment file

   Copy `.env.example` to `.env.local` in the project root.

   The default development configuration uses:

   ```env
   DATABASE_URL="postgresql://your-neon-user:your-neon-password@your-project-pooler.region.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://your-neon-user:your-neon-password@your-project.region.aws.neon.tech/neondb?sslmode=require"
   # Optional for metadata routes (robots/sitemap)
   NEXT_PUBLIC_SITE_URL="https://drinksnbbq.com.br"
   ```

4. Run database migrations

   ```bash
   npm run db:migrate
   ```

5. Verify toolchain health

   ```bash
   npm run check
   ```

6. Start the development server

   ```bash
   npm run dev
   ```

---

## Database Notes

- Local Prisma CLI commands load `.env.local` via `prisma.config.ts`.
- Runtime Prisma client reads `DATABASE_URL` and validates target alignment against
  `DATABASE_URL_UNPOOLED`.
- `DATABASE_URL` should use Neon pooled host; `DATABASE_URL_UNPOOLED` should use non-pooling host.
- Both URLs must target the same Neon project/branch.
- Prisma client output is generated into `generated/prisma` (gitignored).
- The migration pipeline has been verified and documented in:

  `docs/planning/milestone-0/issues/M0-04-run-initial-migration-pipeline.md`

If DB connection variables are missing, invalid, or mismatched, Prisma and the application fail
fast.

---

## Verification Commands

- Full quality gate: `npm run check`
- Domain tests only: `npm run test`
- Milestone 1 proof: `npm run db:reset && npm run proof:m1`

---

## Planned but Not Implemented Yet

- Category and item domain models
- Publish flow (`DRAFT -> PUBLISHED -> new DRAFT`)
- Public read path
- Authentication boundary
- Admin and public UI behavior

These remain in Milestones 2-5.

---

# Non-Goals

- Multi-restaurant support
- SaaS platform capabilities
- Online ordering or payment workflows
- Role-based access control
- Inventory management
- External system integrations

Scope changes require explicit architectural decisions.

---

# Status

- Phase A - Foundation and Governance: Complete
- Phase B - Repository Initialization: Complete
- Phase C - Milestone 0: Complete
- Phase D - Milestone 1: Complete (2026-03-18)

Milestone 0 established the governed repository baseline and deterministic Prisma toolchain,
verified migration pipeline, and fully reproducible clean-clone setup.

Milestone 1 added domain-level draft bootstrap and deterministic draft retrieval with explicit
invariant enforcement.

Current focus is Milestone 2 - Categories Ordered Within Draft.
