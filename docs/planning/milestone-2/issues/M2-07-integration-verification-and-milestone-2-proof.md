## [Documentation] Milestone 2 integration verification proof artifact

## Problem Statement

Milestone 2 cannot close based on local confidence or partial implementation.

The repository needs a reproducible proof artifact showing that categories can be created, moved,
and deleted when empty while preserving the category ordering invariant.

---

## Why Now

Milestones are capability boundaries. Closure requires demonstrable evidence, not just completed
implementation tasks.

This issue records the proof needed to close Milestone 2 and keeps the repository state aligned with
governance docs.

---

## Scope

In scope:

- Add Milestone 2 proof documentation under `docs/planning/milestone-2/issues/**`.
- Document the milestone capability boundary.
- Document the category ordering invariant and failure surface.
- Document required verification commands.
- Include proof of domain unit tests, Prisma migration/reset health, and persistence-backed
  create/move/delete-empty behavior.
- Update `MILESTONES.md` and `docs/planning/milestone-2/ISSUE_MAP.md` only when closure is real.

Out of scope:

- Claiming closure before implementation and proof commands pass
- Items
- Publish flow
- Public read
- Authentication

---

## Acceptance Criteria

- [ ] Proof artifact exists at
      `docs/planning/milestone-2/issues/M2-07-integration-verification-and-milestone-2-proof.md`.
- [ ] Artifact states the Milestone 2 capability boundary.
- [ ] Artifact states the category ordering invariant.
- [ ] Artifact documents explicit exclusions.
- [ ] Artifact includes copy/paste verification commands.
- [ ] Verification includes domain unit tests.
- [ ] Verification includes Prisma migration/reset health.
- [ ] Verification includes persistence-backed proof of create, move, and delete-empty behavior.
- [ ] `MILESTONES.md` and the issue map are updated only after proof passes.

---

## Architectural Notes

- Problem type: closure evidence
- The proof must answer: what can the system reliably do now that it could not do before?
- Expected capability: the domain layer can create, move, and delete empty categories within the
  draft `MenuVersion` workspace while preserving 0-based, contiguous, unique category ordering per
  version.
- No ADR expected unless implementation introduces new cross-cutting constraints.

---

## References

- Related Milestone: Milestone 2 - Categories Ordered Within Draft
- Related GitHub Issue: #93
- Related Issue Map Entry: M2-07
