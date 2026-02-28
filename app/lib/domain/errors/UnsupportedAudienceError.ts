import { DomainError } from './DomainError';
import type { Audience } from '../Audience';

type UnsupportedAudienceMeta = {
  audience: Audience;
};

export class UnsupportedAudienceError extends DomainError<UnsupportedAudienceMeta> {
  constructor(meta: UnsupportedAudienceMeta) {
    super('UNSUPPORTED_AUDIENCE', 'Unsupported audience for this domain operation.', meta);

    this.name = 'UnsupportedAudienceError';
  }
}
