## [Feature] Implement Postgres singleton-DRAFT enforcement

## Problem Statement

ADR-011 records that the singleton DRAFT workspace invariant must be enforced in Postgres with a
partial unique index and repository conflict readback.

The current implementation enforces the single-DRAFT invariant in the domain layer, but the database
does not yet prevent duplicate DRAFT rows and `PrismaMenuVersionRepository.createDraft()` does not
yet reconcile create conflicts during empty-database bootstrap.

---

## Why This Matters Now

Milestone 2 mutation flows depend on a trustworthy draft workspace.

Before adding broader category mutation behavior, the system should close the storage-level gap for
the existing draft invariant so category operations are not built on a partially enforced workspace
foundation.

---

## Success Criteria

- [ ] A Postgres migration adds a partial unique index for singleton DRAFT enforcement.
- [ ] The index is named `MenuVersion_single_draft_key`.
- [ ] The index enforces uniqueness for `MenuVersion.status = 'DRAFT'`.
- [ ] `PrismaMenuVersionRepository.createDraft()` translates the expected create-conflict path into
      a read of the singleton DRAFT.
- [ ] Non-constraint failures still surface.
- [ ] Zero-DRAFT or multiple-DRAFT corruption during normal reads still fails loudly in the domain.
- [ ] Deterministic tests cover sequential bootstrap behavior.
- [ ] Deterministic tests cover create-conflict readback behavior.
- [ ] Verification passes through the repo quality gate.

---

## Scope & Constraints

In scope:

- Add the Postgres partial unique index required by ADR-011.
- Implement repository create-conflict readback for bootstrap creation.
- Add focused tests for bootstrap conflict behavior.
- Keep the domain invariant posture unchanged.

Out of scope:

- Category move/delete behavior
- Category append concurrency hardening
- Publish flow
- Public read behavior
- UI and route handlers

Constraints:

- This issue must not silently repair non-empty corrupted workspace state.
- The repository may reconcile only the expected create-conflict path during empty bootstrap.
- Domain code must not import Prisma or database-specific error types.
- Persistence remains responsible only for data access, mapping, and database-conflict translation.

---

## Architectural Notes

Problem type: invariant and persistence guardrail.

Required invariant:

Exactly one DRAFT `MenuVersion` exists. The domain enforces this on reads, and Postgres must prevent
duplicate DRAFT rows at the storage layer.

Expected migration shape:

```sql
CREATE UNIQUE INDEX "MenuVersion_single_draft_key"
ON "MenuVersion" ("status")
WHERE "status" = 'DRAFT';
```

This issue implements ADR-011. It should run before M2-05 because category move/delete operations
depend on the draft workspace invariant.

---

## References

- Related ADR: ADR-011 - Postgres singleton-DRAFT enforcement model
- Related Milestone: Milestone 2 - Categories Ordered Within Draft
- Related Roadmap: Current Focus / ADR-011 follow-ups
