import { describe, expect, test } from 'vitest';
import { DomainError } from '../errors/DomainError';
import { DraftInvariantViolationError } from '../menu-version/DraftInvariantViolationError';

describe('domain error taxonomy', () => {
  test('DomainError carries code and meta', () => {
    const err = new DomainError('TEST_CODE', 'Test message', { a: 1 });

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(DomainError);
    expect(err.code).toBe('TEST_CODE');
    expect(err.meta).toEqual({ a: 1 });
  });

  test('DraftInvariantViolationError is a DomainError with stable code and metadata', () => {
    const err = new DraftInvariantViolationError({
      draftCount: 2,
      draftIds: ['a', 'b'],
    });

    expect(err).toBeInstanceOf(DomainError);
    expect(err).toBeInstanceOf(DraftInvariantViolationError);
    expect(err.code).toBe('DRAFT_INVARIANT_VIOLATION');
    expect(err.meta).toEqual({
      draftCount: 2,
      draftIds: ['a', 'b'],
    });
  });
});
