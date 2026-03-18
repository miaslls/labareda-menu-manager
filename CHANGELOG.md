# Changelog

This file records user-visible capability changes and operational milestones for the repository.

The project follows milestone-based delivery. Entries are written when a milestone closes or when
behavior changes in a way that affects users or contributors.

---

## Unreleased

- No unreleased changes yet after `0.2.0`.

---

## 0.2.0 - Milestone 1 Complete (2026-03-18)

Milestone 1 closure documentation and implementation alignment updates.

### Added

- `MenuVersion` domain model and repository boundary for Milestone 1
- Single-DRAFT invariant enforcement in domain:
  - `requireSingleDraftMenuVersion()`
  - `DraftInvariantViolationError` (`DRAFT_INVARIANT_VIOLATION`)
- Audience model and draft read operation:
  - `getDraftWorkspace(audience, repo)`
  - `UnsupportedAudienceError` (`UNSUPPORTED_AUDIENCE`)
- Deterministic draft bootstrap operation:
  - `ensureDraftWorkspace(repo)`
- Milestone proof runner:
  - `npm run proof:m1`
  - `scripts/proof-m1.integration.test.ts`

### Changed

- Root documentation aligned to implementation status (Milestone 1 complete, Milestone 2 next)
- Architecture reference clarified to state that domain code must not import Prisma

### Verification State

- `npm run db:reset` proves clean database bootstrap
- `npm run proof:m1` proves deterministic single-draft behavior
- `npm run test` passes domain test suite
- `npm run check` passes full quality gate (`format:check`, `typecheck`, `lint`, `test`, `build`)

### Known Deferrals

- ADR-009 concurrency hardening follow-ups remain intentionally deferred post-M1

---

## 0.1.0 - Milestone 0 Complete (2026-02-15)

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
- Prisma configured with SQLite
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

Milestone 0 formally closes with a fully bootstrappable, governed system ready for domain modeling.
