import { describe, expect, test } from 'vitest';

import { MenuVersionRepository } from '../menu-version/repositories/MenuVersionRepository';
import { getDraftWorkspace } from '../menu-version/getDraftWorkspace';
import { MENU_VERSION_STATUS } from '../menu-version/MenuVersionStatus';
import { AUDIENCE } from '../Audience';

import type { MenuVersion } from '../menu-version/MenuVersion';
import { UnsupportedAudienceError } from '../errors/UnsupportedAudienceError';
import { DraftInvariantViolationError } from '../menu-version/DraftInvariantViolationError';

class FakeMenuVersionRepository implements MenuVersionRepository {
  private readonly versions: MenuVersion[];

  constructor(versions: MenuVersion[]) {
    this.versions = versions;
  }

  async listAll(): Promise<MenuVersion[]> {
    return this.versions;
  }
}

describe('getDraftWorkspace', () => {
  const versions = [
    { id: 'draft-1', status: MENU_VERSION_STATUS.DRAFT },
    { id: 'pub-1', status: MENU_VERSION_STATUS.PUBLISHED },
  ];

  const fakeRepo = new FakeMenuVersionRepository(versions);

  test('returns draft when audience is adminEdit', async () => {
    const draft = await getDraftWorkspace(AUDIENCE.ADMIN_EDIT, fakeRepo);

    expect(draft.id).toBe('draft-1');
    expect(draft.status).toBe(MENU_VERSION_STATUS.DRAFT);
  });

  test('throws for non-adminEdit audience', async () => {
    try {
      await getDraftWorkspace(AUDIENCE.PUBLIC, fakeRepo);
      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(UnsupportedAudienceError);

      if (!(err instanceof UnsupportedAudienceError)) {
        throw new Error('expected UnsupportedAudienceError');
      }

      expect(err.code).toBe('UNSUPPORTED_AUDIENCE');
      expect(err.meta.audience).toBe(AUDIENCE.PUBLIC);
    }
  });

  test('bubbles up invariant failure', async () => {
    const versions = [{ id: 'pub-1', status: MENU_VERSION_STATUS.PUBLISHED }];
    const fakeRepo = new FakeMenuVersionRepository(versions);

    try {
      await getDraftWorkspace(AUDIENCE.ADMIN_EDIT, fakeRepo);
      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(DraftInvariantViolationError);

      if (!(err instanceof DraftInvariantViolationError)) {
        throw new Error('expected DraftInvariantViolationError');
      }

      expect(err.code).toBe('DRAFT_INVARIANT_VIOLATION');
      expect(err.meta.draftCount).toBe(0);
      expect(err.meta.draftIds).toStrictEqual([]);
    }
  });
});
