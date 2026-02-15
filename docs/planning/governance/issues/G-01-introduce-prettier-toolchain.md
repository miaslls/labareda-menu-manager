## [Chore] Introduce Prettier formatting toolchain

## Problem Statement

The repository currently lacks a standardized formatter and a deterministic formatting command.

Without a shared formatting toolchain, diffs become noisy, style drift accumulates, and reviews lose
focus on behavior and invariants.

---

## Why This Matters Now

Formatting should be stabilized early, before domain work begins, to avoid later churn and keep PRs
readable.

---

## Success Criteria

- [ ] Prettier is added as a dev dependency
- [ ] A formatting command exists and is deterministic (`npm run format`)
- [ ] A check command exists and fails on formatting drift (`npm run format:check`)
- [ ] Prettier configuration files are committed (`.prettierrc`, `.prettierignore`)
- [ ] No unrelated behavior changes introduced

---

## Scope & Constraints

In scope:

- Add Prettier + basic scripts
- Add config + ignore files

Out of scope:

- CI enforcement (optional later)
- Repo-wide reformat sweep (avoid churn unless necessary)

---

## Verification Notes

- `npm run format` completes successfully
- `npm run format:check` exits non-zero when formatting differs
