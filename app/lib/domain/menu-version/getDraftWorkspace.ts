import { type Audience, AUDIENCE } from '@domain/Audience';
import { UnsupportedAudienceError } from '@domain/errors/UnsupportedAudienceError';
import { requireSingleDraftMenuVersion } from '@domain/menu-version/requireSingleDraftMenuVersion';

import type { MenuVersion } from '@domain/menu-version/MenuVersion';
import type { MenuVersionRepository } from '@domain/menu-version/repositories/MenuVersionRepository';

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
