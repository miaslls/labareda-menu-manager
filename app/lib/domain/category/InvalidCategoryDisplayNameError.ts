import { DomainError } from '@domain/errors/DomainError';

type InvalidCategoryDisplayNameMeta = {
  reason: 'empty_after_trim' | 'already_exists';
};

export class InvalidCategoryDisplayNameError extends DomainError<InvalidCategoryDisplayNameMeta> {
  constructor(meta: InvalidCategoryDisplayNameMeta) {
    super(
      'INVALID_CATEGORY_DISPLAY_NAME',
      'Category display name must contain visible text and be unique within the draft workspace.',
      meta
    );

    this.name = 'InvalidCategoryDisplayNameError';
  }
}
