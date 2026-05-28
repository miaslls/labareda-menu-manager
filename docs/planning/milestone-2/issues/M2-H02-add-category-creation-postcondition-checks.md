## [Feature] Add domain postcondition checks for category creation

## Problem Statement

The category creation domain operation issues a command to persistence with an intended
`menuVersionId`, `position`, and normalized `displayName`.

The operation currently relies on the repository contract to return the category it was asked to
create. That is acceptable for the initial Milestone 2 behavior, but a hardened domain operation
should fail loudly if persistence returns a category that violates the command's postcondition.

---

## Why This Matters Now

This is intentionally deferred until after the main Milestone 2 create, move, delete, and proof
slices are complete.

The initial milestone can rely on repository contract tests and focused operation tests. This issue
adds a stronger boundary check after the core behavior is already proven.

---

## Success Criteria

- [ ] Category creation returns the created category when persistence returns the expected record.
- [ ] Category creation fails loudly when persistence returns the wrong `menuVersionId`.
- [ ] Category creation fails loudly when persistence returns the wrong `position`.
- [ ] Category creation fails loudly when persistence returns the wrong `displayName`.
- [ ] Tests use DB-free fakes and do not require Prisma.

---

## Scope & Constraints

In scope:

- Add a postcondition check to the domain operation that creates a category in the draft workspace.
- Introduce or reuse an explicit error for returned persistence state that violates domain intent.
- Cover success and failure paths with deterministic domain tests.

Out of scope:

- Concurrency hardening
- Category UI
- Route handlers
- Item behavior
- Persistence repair behavior

Constraints:

- The postcondition check must not repair bad persistence output.
- The persistence adapter remains a thin data access and mapping layer.
- The domain operation owns the expected result of its command.

---

## Architectural Notes

Problem type: contract and boundary validation.

Minimum postcondition:

- returned `menuVersionId` equals the draft workspace id
- returned `position` equals the computed append position
- returned `displayName` equals the domain-normalized display name

Optional postcondition:

- returned `id` is present if persisted domain entities are required to have an id

This issue should not start until the basic Milestone 2 category behavior is implemented and
verified.
