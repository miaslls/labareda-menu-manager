# Scope

Status: Active. Defines functional boundaries of the system.
Changes to scope require architectural review and may require a new ADR.

---

# Core Purpose

Labareda Menu Manager is a single-restaurant administrative tool that enables:

- Draft editing of menu structure and items
- Controlled publishing to a public menu
- Safe preview before publication
- Deterministic ordering of categories and items

The system is intentionally constrained and does not aim to be a general restaurant platform.

---

# In-Scope

The following capabilities are explicitly in scope:

## Menu Management

- Create, update, and order categories
- Create, update, order, and hide items
- Store item pricing as integer BRL centavos (`priceCents`)

## Workspace Model

- Single editable DRAFT workspace
- Single PUBLISHED workspace
- Atomic publish operation
- Automatic draft seeding after publish

## Public Menu

- Public-facing read from PUBLISHED workspace
- Visibility-based inclusion rules

## Governance

- ADR-based architectural evolution
- Strict layered architecture
- Transactional integrity for publish and ordering operations

---

# Explicit Non-Goals

The following are intentionally excluded from the current system:

- Multi-restaurant tenancy
- Multi-user account management or role-based access control
- Version history browsing or rollback UI
- Scheduled publishing
- Inventory management
- Online ordering or payments
- Third-party integrations
- Distributed or multi-database architecture

These exclusions are intentional design constraints, not temporary omissions.

---

# Stability Policy

Scope is considered stable as of Milestone 0.

New features that expand beyond this scope require:

- Explicit discussion
- Architectural impact evaluation
- ADR entry if structural implications exist

Scope drift without decision recording is treated as governance violation.

---

# Guiding Principle

Clarity over breadth.

The system prioritizes correctness, architectural discipline, and maintainability over feature expansion.

