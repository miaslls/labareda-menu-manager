import { DomainError } from '@domain/errors/DomainError';

import type { Audience } from '@domain/Audience';

type UnsupportedAudienceMeta = {
  audience: Audience;
};

export class UnsupportedAudienceError extends DomainError<UnsupportedAudienceMeta> {
  constructor(meta: UnsupportedAudienceMeta) {
    super('UNSUPPORTED_AUDIENCE', 'Unsupported audience for this domain operation.', meta);

    this.name = 'UnsupportedAudienceError';
  }
}
