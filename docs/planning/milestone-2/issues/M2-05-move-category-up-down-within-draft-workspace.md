## [Feature] Move category up and down within draft workspace

## Problem Statement

Milestone 2 requires categories to be ordered within the draft workspace.

The system needs a controlled move operation that changes a category by one position while
preserving 0-based, contiguous, unique ordering.

---

## Why Now

Once categories can be created with valid positions, the next required behavior is local reordering.

The move operation must validate current state before mutation so it does not build on corrupted
ordering.

---

## Scope

In scope:

- Add a domain operation for moving a draft category up or down by one position.
- Validate current category order before mutation.
- Swap with the adjacent category in the requested direction.
- Choose and test boundary behavior for first/last category moves.
- Write only affected category positions.
- Add deterministic domain tests.

Out of scope:

- Arbitrary drag-and-drop repositioning
- UI and route handlers
- Item ordering
- Publish behavior

---

## Acceptance Criteria

- [ ] Operation validates current order before mutation.
- [ ] Moving up swaps with the previous category.
- [ ] Moving down swaps with the next category.
- [ ] Boundary behavior is explicit and tested for first category moving up.
- [ ] Boundary behavior is explicit and tested for last category moving down.
- [ ] Operation writes only affected category positions.
- [ ] Corrupted existing order prevents movement.

---

## Architectural Notes

- Problem type: transformation
- Boundary no-op vs domain failure must be chosen before implementation.
- The domain owns the move rule; persistence only applies writes.
- No UI behavior should define lifecycle semantics.

---

## References

- Related ADR: ADR-012 - Category ordering field name is position
- Related Milestone: Milestone 2 - Categories Ordered Within Draft
- Related GitHub Issue: #91
- Related Issue Map Entry: M2-05
