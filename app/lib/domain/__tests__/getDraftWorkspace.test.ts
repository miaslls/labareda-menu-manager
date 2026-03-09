import { describe, expect, test } from 'vitest';

import { AUDIENCE } from '@domain/Audience';
import { UnsupportedAudienceError } from '@domain/errors/UnsupportedAudienceError';
import { DraftInvariantViolationError } from '@domain/menu-version/DraftInvariantViolationError';
import { getDraftWorkspace } from '@domain/menu-version/getDraftWorkspace';
import { MENU_VERSION_STATUS } from '@domain/menu-version/MenuVersionStatus';

import type { MenuVersion } from '@domain/menu-version/MenuVersion';
import type { MenuVersionRepository } from '@domain/menu-version/repositories/MenuVersionRepository';

class FakeMenuVersionRepository implements MenuVersionRepository {
  private readonly versions: MenuVersion[];

  constructor(versions: MenuVersion[]) {
    this.versions = versions.map((version) => ({ ...version }));
  }

  async listAll(): Promise<MenuVersion[]> {
    return this.versions.map((version) => ({ ...version }));
  }

  async createDraft(): Promise<MenuVersion> {
    throw new Error('Not needed in getDraftWorkspace tests.');
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
