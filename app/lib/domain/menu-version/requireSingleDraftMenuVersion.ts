import { DraftInvariantViolationError } from './DraftInvariantViolationError';
import { MENU_VERSION_STATUS } from './MenuVersionStatus';

import type { MenuVersion } from './MenuVersion';

export function requireSingleDraftMenuVersion(versions: MenuVersion[]): MenuVersion {
  const drafts = versions.filter((version) => version.status === MENU_VERSION_STATUS.DRAFT);
  const draftCount = drafts.length;

  if (draftCount !== 1) {
    const draftIds = drafts.map((draft) => draft.id);

    throw new DraftInvariantViolationError({ draftCount, draftIds });
  }

  return drafts[0];
}
