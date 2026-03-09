import { DraftInvariantViolationError } from '@domain/menu-version/DraftInvariantViolationError';
import { MENU_VERSION_STATUS } from '@domain/menu-version/MenuVersionStatus';

import type { MenuVersion } from '@domain/menu-version/MenuVersion';

export function requireSingleDraftMenuVersion(versions: MenuVersion[]): MenuVersion {
  const drafts = versions.filter((version) => version.status === MENU_VERSION_STATUS.DRAFT);
  const draftCount = drafts.length;

  if (draftCount !== 1) {
    const draftIds = drafts.map((draft) => draft.id);

    throw new DraftInvariantViolationError({ draftCount, draftIds });
  }

  return drafts[0];
}
