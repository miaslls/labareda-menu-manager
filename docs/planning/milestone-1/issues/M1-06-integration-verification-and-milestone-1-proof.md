## [Documentation] Milestone 1 governance verification proof artifact

## Problem Statement

Milestone 1 cannot be closed based on “it seems to work.”

We need a reproducible proof artifact that demonstrates the milestone capability end-to-end:

- Schema includes MenuVersion
- Domain enforces single DRAFT invariant
- Domain can retrieve the DRAFT workspace deterministically
- Clean database produces exactly one DRAFT
- Tests prove invariant behavior and remain deterministic

Currently, these facts may exist across code and local knowledge, but they are not yet captured as a
single, copy/paste verification sequence.

---

## Why This Matters Now

Milestones represent capability boundaries and must be demonstrable.

This issue produces the closure evidence for Milestone 1 and prevents “chat-based truth” from
becoming the canonical source.

The repo should be self-verifying.

---

## Success Criteria

- [ ] A documented, copy/paste command sequence exists to verify Milestone 1 from a clean state
- [ ] Verification includes:
  - test proof (`npm run test`)
  - toolchain health (`npm run check`)
  - clean DB proof (`npm run db:reset` + deterministic draft creation)
- [ ] Documentation explicitly states the Milestone 1 capability boundary and what is excluded
- [ ] Documentation references the invariant and how failure is surfaced
- [ ] Any required script or snippet used for verification is present in-repo and easy to run

---

## Scope & Constraints

In scope:

- Create or update a Milestone 1 verification artifact under `docs/planning/milestone-1/issues/` (or
  the project’s chosen proof location)
- Include:
  - exact commands to run
  - expected outcomes
  - what “success” looks like
- If needed, add a minimal script under `scripts/` to exercise `ensureDraftWorkspace()` and print a
  clear outcome

Out of scope:

- Any UI exposure
- Any route handlers
- Any publish logic
- Any category/item modeling

Constraints:

- Proof must be reproducible on a clean clone
- Proof must not rely on hidden local state
- Steps must be deterministic and minimal
- No manual database poking or “open SQLite and look” steps

---

## Verification Notes (What This Issue Produces)

The artifact must enable someone to run something like:

- `npm ci`
- `npm run db:reset`
- `npm run test`
- `npm run check`
- (optional) `node scripts/...` to prove draft creation + retrieval

…and conclude confidently:

Milestone 1 is closed.

---

## Milestone 1 Closure Statement (Must Appear in Artifact)

Capability unlocked:

The domain layer can reliably retrieve the draft MenuVersion workspace, with the invariant that
exactly one DRAFT exists, and a clean database will produce exactly one DRAFT deterministically.

Explicitly excluded:

- Categories
- Items
- Publish flow
- Public reads
- Authentication
- UI
