import { requireSingleDraftMenuVersion } from './requireSingleDraftMenuVersion';

import type { MenuVersion } from './MenuVersion';
import type { MenuVersionRepository } from './repositories/MenuVersionRepository';

export async function ensureDraftWorkspace(repo: MenuVersionRepository): Promise<MenuVersion> {
  const versions = await repo.listAll();

  if (versions.length === 0) {
    return await repo.createDraft();
  } else {
    return requireSingleDraftMenuVersion(versions);
  }
}
