import { describe, expect, test } from 'vitest';

import { DraftInvariantViolationError } from '../menu-version/DraftInvariantViolationError';
import { ensureDraftWorkspace } from '../menu-version/ensureDraftWorkspace';
import { MENU_VERSION_STATUS } from '../menu-version/MenuVersionStatus';

import type { MenuVersion } from '../menu-version/MenuVersion';
import type { MenuVersionRepository } from '../menu-version/repositories/MenuVersionRepository';

class FakeMenuVersionRepository implements MenuVersionRepository {
  private readonly versions: MenuVersion[];
  private createDraftCalls = 0;

  constructor(versions: MenuVersion[]) {
    this.versions = versions.map((version) => ({ ...version }));
  }

  async listAll(): Promise<MenuVersion[]> {
    return this.versions.map((version) => ({ ...version }));
  }

  async createDraft(): Promise<MenuVersion> {
    this.createDraftCalls++;
    const newDraft: MenuVersion = {
      id: `generated-draft-${this.createDraftCalls.toString().padStart(2, '0')}`,
      status: MENU_VERSION_STATUS.DRAFT,
    };

    this.versions.push(newDraft);

    return newDraft;
  }

  get createDraftCallCount(): number {
    return this.createDraftCalls;
  }
}

describe('ensureDraftWorkspace', () => {
  test('creates and returns draft when repository is empty', async () => {
    const fakeRepo = new FakeMenuVersionRepository([]);

    const draft = await ensureDraftWorkspace(fakeRepo);
    const versions = await fakeRepo.listAll();

    expect(fakeRepo.createDraftCallCount).toBe(1);
    expect(draft.status).toBe(MENU_VERSION_STATUS.DRAFT);
    expect(versions).toEqual([draft]);
  });

  test('creates draft only once when repeatedly called on empty repository', async () => {
    const fakeRepo = new FakeMenuVersionRepository([]);

    const firstResult = await ensureDraftWorkspace(fakeRepo);
    const secondResult = await ensureDraftWorkspace(fakeRepo);

    expect(fakeRepo.createDraftCallCount).toBe(1);
    expect(firstResult.status).toBe(MENU_VERSION_STATUS.DRAFT);
    expect(firstResult).toEqual(secondResult);

    const versions = await fakeRepo.listAll();
    expect(versions).toEqual([firstResult]);
  });

  test('returns existing draft when repository already contains one', async () => {
    const initialDraft: MenuVersion = { id: 'draft-01', status: MENU_VERSION_STATUS.DRAFT };

    const fakeRepo = new FakeMenuVersionRepository([initialDraft]);

    const draft = await ensureDraftWorkspace(fakeRepo);

    expect(fakeRepo.createDraftCallCount).toBe(0);
    expect(draft).toEqual(initialDraft);

    const versions = await fakeRepo.listAll();
    expect(versions).toEqual([initialDraft]);
  });

  test('throws when repository contains versions but no draft exists', async () => {
    const initialVersions: MenuVersion[] = [
      { id: 'pub-01', status: MENU_VERSION_STATUS.PUBLISHED },
    ];

    const fakeRepo = new FakeMenuVersionRepository(initialVersions);

    try {
      await ensureDraftWorkspace(fakeRepo);
      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(DraftInvariantViolationError);

      if (!(err instanceof DraftInvariantViolationError)) {
        throw new Error('expected DraftInvariantViolationError');
      }

      expect(fakeRepo.createDraftCallCount).toBe(0);
      expect(err.code).toBe('DRAFT_INVARIANT_VIOLATION');
      expect(err.meta.draftCount).toBe(0);
      expect(err.meta.draftIds).toEqual([]);

      const versions = await fakeRepo.listAll();
      expect(versions).toEqual(initialVersions);
    }
  });

  test('throws when repository contains multiple drafts', async () => {
    const initialVersions: MenuVersion[] = [
      { id: 'draft-1', status: MENU_VERSION_STATUS.DRAFT },
      { id: 'draft-2', status: MENU_VERSION_STATUS.DRAFT },
    ];

    const fakeRepo = new FakeMenuVersionRepository(initialVersions);

    try {
      await ensureDraftWorkspace(fakeRepo);
      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(DraftInvariantViolationError);

      if (!(err instanceof DraftInvariantViolationError)) {
        throw new Error('expected DraftInvariantViolationError');
      }

      expect(fakeRepo.createDraftCallCount).toBe(0);
      expect(err.code).toBe('DRAFT_INVARIANT_VIOLATION');
      expect(err.meta.draftCount).toBe(2);
      expect(err.meta.draftIds).toEqual(['draft-1', 'draft-2']);

      const versions = await fakeRepo.listAll();
      expect(versions).toEqual(initialVersions);
    }
  });
});
