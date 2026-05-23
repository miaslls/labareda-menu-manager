import { DomainError } from '@domain/errors/DomainError';

type CategoryOrderingInvariantViolationMeta = {
  menuVersionIds: string[];
  categoryCount: number;
  positions: number[];
  duplicatePositions: number[];
  missingPositions: number[];
};

export class CategoryOrderingInvariantViolationError extends DomainError<CategoryOrderingInvariantViolationMeta> {
  constructor(meta: CategoryOrderingInvariantViolationMeta) {
    super(
      'ORDERING_INVARIANT_VIOLATION',
      'Expected category positions to be 0-based, contiguous, and unique for a single MenuVersion.',
      meta
    );

    this.name = 'CategoryOrderingInvariantViolationError';
  }
}
