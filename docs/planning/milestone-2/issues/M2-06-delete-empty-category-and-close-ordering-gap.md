## [Feature] Delete empty category and close ordering gap

## Problem Statement

Milestone 2 requires empty draft categories to be deletable without leaving ordering gaps.

Deleting a category must preserve contiguous order and must not silently delete or orphan future
item data.

---

## Why Now

Create and move are not enough for category lifecycle. The milestone explicitly requires
delete-empty-category behavior.

This issue adds deletion while preserving the ordering invariant and keeping item-related behavior
excluded.

---

## Scope

In scope:

- Add a domain operation for deleting an empty category from the draft workspace.
- Validate current order before deletion.
- Confirm the category belongs to the draft workspace.
- Refuse to delete non-empty categories.
- Delete the selected category.
- Shift later categories down by one position.
- Add deterministic domain tests.

Out of scope:

- Cascading item deletion
- Item model implementation
- UI and route handlers
- Public read behavior

---

## Acceptance Criteria

- [ ] Operation validates current order before deletion.
- [ ] Operation confirms the category belongs to the draft workspace.
- [ ] Operation refuses to delete non-empty categories explicitly.
- [ ] Deleting the first category closes positions.
- [ ] Deleting a middle category closes positions.
- [ ] Deleting the last category leaves earlier positions unchanged.
- [ ] Corrupted existing order prevents deletion.

---

## Architectural Notes

- Problem type: lifecycle and state transition
- Empty-category policy belongs in the domain layer.
- Persistence adapters must not decide whether deletion is allowed.
- Item behavior remains intentionally excluded from Milestone 2.

---

## References

- Related ADR: ADR-012 - Category ordering field name is position
- Related Milestone: Milestone 2 - Categories Ordered Within Draft
- Related GitHub Issue: #92
- Related Issue Map Entry: M2-06
