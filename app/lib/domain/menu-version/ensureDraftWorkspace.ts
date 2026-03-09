import { requireSingleDraftMenuVersion } from '@domain/menu-version/requireSingleDraftMenuVersion';

import type { MenuVersion } from '@domain/menu-version/MenuVersion';
import type { MenuVersionRepository } from '@domain/menu-version/repositories/MenuVersionRepository';

export async function ensureDraftWorkspace(repo: MenuVersionRepository): Promise<MenuVersion> {
  const versions = await repo.listAll();

  if (versions.length === 0) {
    return await repo.createDraft();
  } else {
    return requireSingleDraftMenuVersion(versions);
  }
}
