import { describe, expect, test } from 'vitest';

import { AUDIENCE } from '@domain/Audience';
import { CategoryOrderingInvariantViolationError } from '@domain/category/CategoryOrderingInvariantViolationError';
import { createCategoryInDraftWorkspace } from '@domain/category/createCategoryInDraftWorkspace';
import { InvalidCategoryDisplayNameError } from '@domain/category/InvalidCategoryDisplayNameError';
import { MENU_VERSION_STATUS } from '@domain/menu-version/MenuVersionStatus';

import type { Category } from '@domain/category/Category';
import type { CreateCategoryInput } from '@domain/category/CreateCategoryInput';
import type { CategoryRepository } from '@domain/category/repositories/CategoryRepository';
import type { MenuVersion } from '@domain/menu-version/MenuVersion';
import type { MenuVersionRepository } from '@domain/menu-version/repositories/MenuVersionRepository';

class FakeCategoryRepository implements CategoryRepository {
  private readonly categories: Category[];
  private createCategoryCalls = 0;

  constructor(categories: Category[]) {
    this.categories = categories.map((category) => ({ ...category }));
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    this.createCategoryCalls++;

    const newCategory = {
      id: `category-${input.menuVersionId}-${input.position}`,
      ...input,
    };

    this.categories.push(newCategory);

    return { ...newCategory };
  }

  async listByMenuVersionId(menuVersionId: string): Promise<Category[]> {
    const categoriesByMenuVersionId = this.categories
      .filter((category) => category.menuVersionId === menuVersionId)
      .sort((a, b) => a.position - b.position);

    return categoriesByMenuVersionId.map((category) => ({ ...category }));
  }

  get createCategoryCallCount(): number {
    return this.createCategoryCalls;
  }
}

class FakeMenuVersionRepository implements MenuVersionRepository {
  private readonly menuVersions: MenuVersion[];

  constructor(menuVersions: MenuVersion[]) {
    this.menuVersions = menuVersions.map((version) => ({ ...version }));
  }

  async listAll(): Promise<MenuVersion[]> {
    return this.menuVersions.map((version) => ({ ...version }));
  }

  async createDraft(): Promise<MenuVersion> {
    throw new Error('Not needed in createCategoryInDraftWorkspace tests');
  }
}

function createDraftMenuVersionRepository(): FakeMenuVersionRepository {
  return new FakeMenuVersionRepository([
    {
      id: 'draft-menu-version',
      status: MENU_VERSION_STATUS.DRAFT,
    },
  ]);
}

describe('createCategoryInDraftWorkspace', () => {
  test('creates the first category at position 0 with a trimmed display name', async () => {
    const fakeCategoryRepository = new FakeCategoryRepository([]);
    const fakeMenuVersionRepository = createDraftMenuVersionRepository();

    const category = await createCategoryInDraftWorkspace(
      AUDIENCE.ADMIN_EDIT,
      fakeCategoryRepository,
      fakeMenuVersionRepository,
      ' Drinks '
    );

    expect(category.displayName).toBe('Drinks');
    expect(category.position).toBe(0);
    expect(category.menuVersionId).toBe('draft-menu-version');
    expect(fakeCategoryRepository.createCategoryCallCount).toBe(1);
  });

  test('appends a later category at the next contiguous position with a trimmed display name', async () => {
    const initialCategories: Category[] = [
      {
        id: 'category-draft-menu-version-0',
        menuVersionId: 'draft-menu-version',
        position: 0,
        displayName: 'Appetizers',
      },
      {
        id: 'category-draft-menu-version-1',
        menuVersionId: 'draft-menu-version',
        position: 1,
        displayName: 'Main Courses',
      },
    ];

    const fakeCategoryRepository = new FakeCategoryRepository(initialCategories);
    const fakeMenuVersionRepository = createDraftMenuVersionRepository();

    const category = await createCategoryInDraftWorkspace(
      AUDIENCE.ADMIN_EDIT,
      fakeCategoryRepository,
      fakeMenuVersionRepository,
      ' Drinks '
    );

    expect(category.displayName).toBe('Drinks');
    expect(category.position).toBe(2);
    expect(category.menuVersionId).toBe('draft-menu-version');
    expect(fakeCategoryRepository.createCategoryCallCount).toBe(1);
  });

  test('throws and does not create a category when display name is empty after trimming', async () => {
    const fakeCategoryRepository = new FakeCategoryRepository([]);
    const fakeMenuVersionRepository = createDraftMenuVersionRepository();

    try {
      await createCategoryInDraftWorkspace(
        AUDIENCE.ADMIN_EDIT,
        fakeCategoryRepository,
        fakeMenuVersionRepository,
        '  '
      );

      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidCategoryDisplayNameError);

      if (!(err instanceof InvalidCategoryDisplayNameError)) {
        throw new Error('expected InvalidCategoryDisplayNameError');
      }

      expect(err.code).toBe('INVALID_CATEGORY_DISPLAY_NAME');
      expect(err.meta.reason).toBe('empty_after_trim');
      expect(fakeCategoryRepository.createCategoryCallCount).toBe(0);

      const categories = await fakeCategoryRepository.listByMenuVersionId('draft-menu-version');

      expect(categories).toEqual([]);
    }
  });

  test('throws and does not create a category when existing draft category order is corrupt', async () => {
    const initialCategories: Category[] = [
      {
        id: 'category-draft-menu-version-0',
        menuVersionId: 'draft-menu-version',
        displayName: 'Appetizers',
        position: 0,
      },
      {
        id: 'category-draft-menu-version-2',
        menuVersionId: 'draft-menu-version',
        displayName: 'Main Courses',
        position: 2,
      },
    ];

    const fakeCategoryRepository = new FakeCategoryRepository(initialCategories);
    const fakeMenuVersionRepository = createDraftMenuVersionRepository();

    try {
      await createCategoryInDraftWorkspace(
        AUDIENCE.ADMIN_EDIT,
        fakeCategoryRepository,
        fakeMenuVersionRepository,
        'Drinks'
      );

      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(CategoryOrderingInvariantViolationError);

      if (!(err instanceof CategoryOrderingInvariantViolationError)) {
        throw new Error('expected CategoryOrderingInvariantViolationError');
      }

      expect(err.code).toBe('ORDERING_INVARIANT_VIOLATION');
      expect(err.meta.categoryCount).toBe(2);
      expect(err.meta.duplicatePositions).toEqual([]);
      expect(err.meta.menuVersionIds).toEqual(['draft-menu-version']);
      expect(err.meta.missingPositions).toEqual([1]);
      expect(err.meta.positions).toEqual([0, 2]);
      expect(fakeCategoryRepository.createCategoryCallCount).toBe(0);
    }

    const categories = await fakeCategoryRepository.listByMenuVersionId('draft-menu-version');

    expect(categories).toEqual(initialCategories);
  });

  test('throws category ordering violation before duplicate display name when existing order is corrupt', async () => {
    const initialCategories: Category[] = [
      {
        id: 'category-draft-menu-version-0',
        menuVersionId: 'draft-menu-version',
        displayName: 'Appetizers',
        position: 0,
      },
      {
        id: 'category-draft-menu-version-2',
        menuVersionId: 'draft-menu-version',
        displayName: 'Drinks',
        position: 2,
      },
    ];

    const fakeCategoryRepository = new FakeCategoryRepository(initialCategories);
    const fakeMenuVersionRepository = createDraftMenuVersionRepository();

    try {
      await createCategoryInDraftWorkspace(
        AUDIENCE.ADMIN_EDIT,
        fakeCategoryRepository,
        fakeMenuVersionRepository,
        'Drinks'
      );

      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(CategoryOrderingInvariantViolationError);

      if (!(err instanceof CategoryOrderingInvariantViolationError)) {
        throw new Error('expected CategoryOrderingInvariantViolationError');
      }

      expect(err.code).toBe('ORDERING_INVARIANT_VIOLATION');
      expect(err.meta.categoryCount).toBe(2);
      expect(err.meta.duplicatePositions).toEqual([]);
      expect(err.meta.menuVersionIds).toEqual(['draft-menu-version']);
      expect(err.meta.missingPositions).toEqual([1]);
      expect(err.meta.positions).toEqual([0, 2]);
      expect(fakeCategoryRepository.createCategoryCallCount).toBe(0);
    }

    const categories = await fakeCategoryRepository.listByMenuVersionId('draft-menu-version');

    expect(categories).toEqual(initialCategories);
  });

  test('throws and does not create a category when normalized display name already exists', async () => {
    const initialCategories: Category[] = [
      {
        id: 'category-draft-menu-version-0',
        menuVersionId: 'draft-menu-version',
        displayName: 'Drinks',
        position: 0,
      },
    ];

    const fakeCategoryRepository = new FakeCategoryRepository(initialCategories);
    const fakeMenuVersionRepository = createDraftMenuVersionRepository();

    try {
      await createCategoryInDraftWorkspace(
        AUDIENCE.ADMIN_EDIT,
        fakeCategoryRepository,
        fakeMenuVersionRepository,
        ' Drinks '
      );

      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidCategoryDisplayNameError);

      if (!(err instanceof InvalidCategoryDisplayNameError)) {
        throw new Error('expected InvalidCategoryDisplayNameError');
      }

      expect(err.code).toBe('INVALID_CATEGORY_DISPLAY_NAME');
      expect(err.meta.reason).toBe('already_exists');
      expect(fakeCategoryRepository.createCategoryCallCount).toBe(0);
    }

    const categories = await fakeCategoryRepository.listByMenuVersionId('draft-menu-version');

    expect(categories).toEqual(initialCategories);
  });

  test('throws and does not create a category when normalized display name already exists with different casing', async () => {
    const initialCategories: Category[] = [
      {
        id: 'category-draft-menu-version-0',
        menuVersionId: 'draft-menu-version',
        displayName: 'Drinks',
        position: 0,
      },
    ];

    const fakeCategoryRepository = new FakeCategoryRepository(initialCategories);
    const fakeMenuVersionRepository = createDraftMenuVersionRepository();

    try {
      await createCategoryInDraftWorkspace(
        AUDIENCE.ADMIN_EDIT,
        fakeCategoryRepository,
        fakeMenuVersionRepository,
        'drinks'
      );

      throw new Error('expected function to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidCategoryDisplayNameError);

      if (!(err instanceof InvalidCategoryDisplayNameError)) {
        throw new Error('expected InvalidCategoryDisplayNameError');
      }

      expect(err.code).toBe('INVALID_CATEGORY_DISPLAY_NAME');
      expect(err.meta.reason).toBe('already_exists');
      expect(fakeCategoryRepository.createCategoryCallCount).toBe(0);
    }

    const categories = await fakeCategoryRepository.listByMenuVersionId('draft-menu-version');

    expect(categories).toEqual(initialCategories);
  });
});
