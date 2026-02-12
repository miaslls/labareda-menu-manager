# GitHub Labels – Canonical Set

Status: Active.
Changes to label taxonomy require governance review.

This document defines the canonical label system used for issues and pull requests.

---

# Labeling Principles

- Every issue and PR must have exactly one `type:` label.
- `area:` labels are optional but recommended.
- `status:` labels are temporary and operational.
- Labels must not overlap in meaning.
- New labels require review to prevent taxonomy drift.

---

# Type Labels (Required – Exactly One)

| Label | Description |
|--------|-------------|
| `type: feature` | New capability or behavior |
| `type: refactor` | Internal restructuring without changing external behavior |
| `type: documentation` | Documentation-only changes |
| `type: decision` | Architectural or structural decision |
| `type: spike` | Time-boxed research or investigation |
| `type: governance` | Repository structure, workflow, or policy updates |

---

# Area Labels (Optional – Zero or More)

| Label | Description |
|--------|-------------|
| `area: admin-ui` | Administrative interface components |
| `area: public-ui` | Public-facing menu interface |
| `area: api` | Route handlers / HTTP boundary |
| `area: lib` | Domain layer (`lib/`) |
| `area: schema` | Prisma schema and migrations |
| `area: docs` | Documentation files |
| `area: tooling` | Scripts and development tooling |
| `area: governance` | Repository configuration and workflow |

---

# Status Labels (Temporary Use)

| Label | Description |
|--------|-------------|
| `status: blocked` | Work cannot proceed due to external dependency |
| `status: needs-info` | Clarification required before proceeding |

---

# Enforcement Notes

- Exactly one `type:` label must be present.
- `area:` labels should align with architectural boundaries defined in `ARCHITECTURE.md`.
- Labels must remain minimal and non-redundant.
- Scope expansion should not introduce label expansion without review.

This taxonomy is intentionally small to preserve clarity and signal quality.

