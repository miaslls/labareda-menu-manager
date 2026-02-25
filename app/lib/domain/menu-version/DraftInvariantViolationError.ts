import { DomainError } from '../errors/DomainError';

type DraftInvariantViolationMeta = {
  draftCount: number;
  draftIds: string[];
};

export class DraftInvariantViolationError extends DomainError {
  constructor(meta: DraftInvariantViolationMeta) {
    super('DRAFT_INVARIANT_VIOLATION', 'Expected exactly one DRAFT MenuVersion.', meta);

    this.name = 'DraftInvariantViolationError';
  }
}
