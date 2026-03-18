## [Documentation] Milestone 1 governance verification proof artifact

## Problem Statement

Milestone 1 cannot be closed based on "it seems to work."

We need a reproducible proof artifact that demonstrates the milestone capability end-to-end:

- Schema includes `MenuVersion`
- Domain enforces the single `DRAFT` invariant
- Domain retrieves the `DRAFT` workspace deterministically
- Clean database bootstrap produces exactly one `DRAFT`
- Tests prove invariant behavior deterministically

---

## Why This Matters Now

Milestones represent capability boundaries and must be demonstrable.

This artifact is the closure evidence for Milestone 1 and keeps repository truth in-repo, not in
chat history.

---

## Success Criteria

- [x] A documented, copy/paste command sequence exists to verify Milestone 1 from a clean state
- [x] Verification includes:
  - test proof (`npm run test`)
  - toolchain health (`npm run check`)
  - clean DB proof (`npm run db:reset` + deterministic draft creation)
- [x] Documentation explicitly states the Milestone 1 capability boundary and what is excluded
- [x] Documentation references the invariant and how failure is surfaced
- [x] Any required script or snippet used for verification is present in-repo and easy to run

Implemented helper:

- `npm run proof:m1`
- `scripts/proof-m1.integration.test.ts`
- `vitest.proof.config.ts`

---

## Milestone 1 Closure Statement

Capability unlocked:

The domain layer can reliably retrieve the draft `MenuVersion` workspace, with the invariant that
exactly one `DRAFT` exists, and a clean database will produce exactly one `DRAFT` deterministically.

Explicitly excluded:

- Categories
- Items
- Publish flow
- Public reads
- Authentication
- UI

---

## Invariant and Failure Surface

Invariant:

- Exactly one `MenuVersion` with status `DRAFT` must exist.

Enforcement surface:

- Domain invariant checker: `requireSingleDraftMenuVersion()`
- Bootstrap operation: `ensureDraftWorkspace()`
- Audience-based read: `getDraftWorkspace(audience, repo)`

Failure behavior:

- Corruption is fail-loud via `DraftInvariantViolationError` (`code: DRAFT_INVARIANT_VIOLATION`)
- Unsupported audience is fail-loud via `UnsupportedAudienceError`
- No silent repair for non-empty corrupted state

---

## Preconditions

- Repository cloned
- Node.js + npm available
- `.env` exists with:

```env
DATABASE_URL="file:./prisma/dev.db"
```

Important:

- Run steps in order
- Do not run `db:reset` and `proof:m1` in parallel

---

## Required Tools

- npm scripts in `package.json`
- Prisma migration/reset pipeline
- Vitest (domain tests + proof runner)
- Next.js build pipeline (via `npm run check`)

---

## Verification Procedure (copy/paste)

```bash
npm ci
npm run db:reset
npm run proof:m1
npm run test
npm run check
```

---

## Expected Outcomes

### `npm run db:reset`

- Applies:
  - `20260212173944_smoke_test`
  - `20260223212023_add_menuversion_model`
- Prints `Database reset successful`

### `npm run proof:m1`

- Runs `scripts/proof-m1.integration.test.ts`
- Asserts clean DB bootstrap path
- Calls `ensureDraftWorkspace()` twice and confirms idempotent single draft
- Calls `getDraftWorkspace(AUDIENCE.ADMIN_EDIT, repo)` and confirms same draft
- Confirms exactly one persisted row with status `DRAFT`
- Prints:

```text
[M1-PROOF] PASS draftId=<id> rowCount=1
```

### `npm run test`

- Domain test suite passes
- Current expected signature:
  - `Test Files 5 passed`
  - `Tests 14 passed`

### `npm run check`

- `format:check`, `typecheck`, `lint`, `test`, and `build` all pass
- Next build completes without errors

---

## Verification Transcript (observed)

Date:

- `2026-03-18`

Observed signatures:

- `npm run db:reset` -> `Database reset successful`
- `npm run proof:m1` -> `[M1-PROOF] PASS ... rowCount=1`
- `npm run test` -> `5 passed`, `14 passed`
- `npm run check` -> full pipeline passed (format/typecheck/lint/test/build)

---

## Troubleshooting

If `proof:m1` fails with `expected ... length 0 but got 1`:

- You did not start from a clean DB state.
- Run `npm run db:reset` again, then rerun `npm run proof:m1`.

If Prisma reports `DATABASE_URL is not defined`:

- Ensure `.env` exists and matches `.env.example`.

If `npm run check` fails on lint/format:

- Run `npm run fix`
- Re-run `npm run check`

If `proof:m1` fails due process or worker startup errors:

- Re-run the command once after the current process exits
- Ensure no overlapping long-running test or tooling processes are active

---

## Out of Scope and Deferred Work

This artifact does not claim closure for concurrency hardening follow-ups tracked in `ADR-009`.
Milestone 1 closure remains the scoped capability above.
