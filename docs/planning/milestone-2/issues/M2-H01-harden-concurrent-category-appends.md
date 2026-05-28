## [Feature] Harden domain category appends against concurrency

## Problem Statement

Milestone 2 category creation appends a new category by reading the current draft categories,
validating the existing order, computing the next position, and writing the new category.

That sequence is correct for serialized calls, but parallel append attempts can compute the same
next position from the same snapshot. The database uniqueness constraint can prevent duplicate
state, but the application still needs an explicit conflict strategy so concurrent creation fails or
reconciles predictably.

---

## Why This Matters Now

This is intentionally deferred until after the main Milestone 2 create, move, delete, and proof
slices are complete.

The initial milestone proves the category ordering invariant and basic mutation behavior. This
hardening issue strengthens that behavior for concurrent admin activity without expanding the core
Milestone 2 closure contract.

---

## Success Criteria

- [ ] Parallel category append attempts cannot create duplicate positions for one `MenuVersion`.
- [ ] A failed concurrent append fails explicitly and does not leave partial state.
- [ ] Existing category-order corruption still fails loudly before creation.
- [ ] The chosen conflict strategy is covered by a focused test or proof.
- [ ] The implementation preserves `UI -> Route Handlers -> Domain -> Persistence`.

---

## Scope & Constraints

In scope:

- Evaluate the smallest concurrency strategy that protects category append behavior.
- Preserve the domain-owned ordering invariant.
- Use persistence-level protection only to make the read, validate, compute, and write sequence
  safe.
- Translate persistence conflicts into a clear application behavior if needed.

Out of scope:

- Category UI
- Route handlers unless needed to surface the chosen conflict behavior
- Item behavior
- Publish/public-read behavior
- Broad transaction architecture outside category operations

Constraints:

- Persistence adapters must not decide whether ordering corruption is acceptable.
- The system must not silently repair category order as part of append hardening.
- Any transaction boundary must remain narrow and justified by the append operation.

---

## Architectural Notes

Problem type: flow and persistence consistency.

Required invariant:

For each `MenuVersion`, category positions remain 0-based, contiguous, and unique after concurrent
append attempts.

Implementation options to evaluate:

- rely on the existing unique `(menuVersionId, position)` constraint and translate conflicts into a
  retryable operation failure
- wrap category append in a transaction with sufficient isolation or locking
- introduce a narrow transaction boundary if category and menu-version repositories need shared
  atomicity

This issue should not start until the basic Milestone 2 category behavior is implemented and
verified.
