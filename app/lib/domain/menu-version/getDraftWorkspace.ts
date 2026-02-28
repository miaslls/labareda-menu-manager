import { requireSingleDraftMenuVersion } from './requireSingleDraftMenuVersion';
import { AUDIENCE, type Audience } from '../Audience';
import { UnsupportedAudienceError } from '../errors/UnsupportedAudienceError';
import type { MenuVersion } from './MenuVersion';
import type { MenuVersionRepository } from './repositories/MenuVersionRepository';

export async function getDraftWorkspace(
  audience: Audience,
  repo: MenuVersionRepository
): Promise<MenuVersion> {
  if (audience !== AUDIENCE.ADMIN_EDIT) {
    throw new UnsupportedAudienceError({ audience });
  }

  const versions = await repo.listAll();
  const draft = requireSingleDraftMenuVersion(versions);

  return draft;
}
