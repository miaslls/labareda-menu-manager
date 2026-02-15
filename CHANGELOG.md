# Changelog

This file records user-visible capability changes and operational milestones for the repository.

The project follows milestone-based delivery. Entries are written when a milestone closes or when
behavior changes in a way that affects users or contributors.

---

## Unreleased

(No changes yet. Milestone 1 work will appear here.)

---

## 0.1.0 — Milestone 0 Complete

Initial governed repository baseline.

This release establishes a deterministic, reproducible technical foundation with disciplined
workflow enforcement.

### Added

- Governance and workflow infrastructure:
  - Issue templates
  - Pull request template
  - Decision template
  - Canonical label taxonomy
  - Protected `main` branch with PR-only workflow
- Milestone-driven execution model
- Next.js App Router skeleton
- TypeScript configuration
- ESLint configuration with unified `check` script
- Prisma 7 configured with SQLite
- Deterministic Prisma client generation
- Initial migration (smoke test model)
- Verified migration reset pipeline
- Clean-clone reproducible setup documented in README
- Prettier formatting toolchain and format verification scripts

### Verification State

- Repository can be cloned and installed via `npm ci`
- Environment configured via `.env.example`
- Migrations apply successfully via `npm run db:migrate`
- Reset pipeline verified via `npm run db:reset`
- Development server runs via `npm run dev`
- Toolchain health verified via `npm run check`

Milestone 0 formally closes with a fully bootstrappable, governed system ready for domain modeling
in Milestone 1.
