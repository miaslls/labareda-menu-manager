import { describe, expect, test } from 'vitest';

import { DraftInvariantViolationError } from '../menu-version/DraftInvariantViolationError';
import { requireSingleDraftMenuVersion } from '../menu-version/requireSingleDraftMenuVersion';
import { MENU_VERSION_STATUS } from '../menu-version/MenuVersionStatus';

function isDraftInvariantViolationError(err: unknown): err is DraftInvariantViolationError {
  return err instanceof DraftInvariantViolationError;
}

function expectDraftInvariantViolation(
  err: unknown,
  expected: { draftCount: number; draftIds: string[] }
) {
  expect(isDraftInvariantViolationError(err)).toBe(true);

  if (!isDraftInvariantViolationError(err)) {
    throw new Error('expected DraftInvariantViolationError');
  }

  expect(err.code).toBe('DRAFT_INVARIANT_VIOLATION');
  expect(err.meta.draftCount).toBe(expected.draftCount);

  expect(err.meta.draftIds).toHaveLength(expected.draftIds.length);
  expect(err.meta.draftIds).toEqual(expect.arrayContaining(expected.draftIds));
}

describe('requireSingleDraftMenuVersion', () => {
  test('returns the single draft when exactly one exists', () => {
    const versions = [
      { id: 'draft-1', status: MENU_VERSION_STATUS.DRAFT },
      { id: 'pub-1', status: MENU_VERSION_STATUS.PUBLISHED },
    ];

    const draft = requireSingleDraftMenuVersion(versions);

    expect(draft.id).toBe('draft-1');
    expect(draft.status).toBe(MENU_VERSION_STATUS.DRAFT);
  });

  test('throws when zero drafts exist', () => {
    const versions = [{ id: 'pub-1', status: MENU_VERSION_STATUS.PUBLISHED }];

    try {
      requireSingleDraftMenuVersion(versions);
      throw new Error('expected function to throw');
    } catch (err) {
      expectDraftInvariantViolation(err, {
        draftCount: 0,
        draftIds: [],
      });
    }
  });

  test('throws when multiple drafts exist', () => {
    const versions = [
      { id: 'draft-1', status: MENU_VERSION_STATUS.DRAFT },
      { id: 'draft-2', status: MENU_VERSION_STATUS.DRAFT },
      { id: 'pub-1', status: MENU_VERSION_STATUS.PUBLISHED },
    ];

    try {
      requireSingleDraftMenuVersion(versions);
      throw new Error('expected function to throw');
    } catch (err) {
      expectDraftInvariantViolation(err, {
        draftCount: 2,
        draftIds: ['draft-1', 'draft-2'],
      });
    }
  });
});
