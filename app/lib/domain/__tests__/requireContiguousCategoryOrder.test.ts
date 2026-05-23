import { describe, expect, test } from 'vitest';

import { CategoryOrderingInvariantViolationError } from '@domain/category/CategoryOrderingInvariantViolationError';
import { requireContiguousCategoryOrder } from '@domain/category/requireContiguousCategoryOrder';

import type { Category } from '@domain/category/Category';

function expectCategoryOrderingViolation(
  err: unknown,
  expected: {
    menuVersionIds: string[];
    categoryCount: number;
    positions: number[];
    duplicatePositions: number[];
    missingPositions: number[];
  }
) {
  expect(err).toBeInstanceOf(CategoryOrderingInvariantViolationError);

  if (!(err instanceof CategoryOrderingInvariantViolationError)) {
    throw new Error('expected CategoryOrderingInvariantViolationError');
  }

  expect(err.code).toBe('ORDERING_INVARIANT_VIOLATION');
  expect(err.meta.menuVersionIds).toHaveLength(expected.menuVersionIds.length);

  for (const menuVersionId of expected.menuVersionIds) {
    expect(err.meta.menuVersionIds).toContain(menuVersionId);
  }

  expect(err.meta.categoryCount).toBe(expected.categoryCount);
  expect(err.meta.positions).toStrictEqual(expected.positions);
  expect(err.meta.duplicatePositions).toStrictEqual(expected.duplicatePositions);
  expect(err.meta.missingPositions).toStrictEqual(expected.missingPositions);
}

describe('requireContiguousCategoryOrder', () => {
  test('returns categories when positions are 0-based contiguous and unique', () => {
    const categories: Category[] = [
      { id: 'category-1', menuVersionId: 'menu-version-1', position: 0, displayName: 'Category 1' },
      { id: 'category-2', menuVersionId: 'menu-version-1', position: 1, displayName: 'Category 2' },
      { id: 'category-3', menuVersionId: 'menu-version-1', position: 2, displayName: 'Category 3' },
    ];

    const result = requireContiguousCategoryOrder(categories);

    expect(result).toBe(categories);
  });

  test('throws when category order starts above 0', () => {
    const categories: Category[] = [
      { id: 'category-1', menuVersionId: 'menu-version-1', position: 1, displayName: 'Category 1' },
      { id: 'category-2', menuVersionId: 'menu-version-1', position: 2, displayName: 'Category 2' },
      { id: 'category-3', menuVersionId: 'menu-version-1', position: 3, displayName: 'Category 3' },
    ];

    try {
      requireContiguousCategoryOrder(categories);
      throw new Error('expected function to throw');
    } catch (err) {
      expectCategoryOrderingViolation(err, {
        menuVersionIds: ['menu-version-1'],
        categoryCount: 3,
        positions: [1, 2, 3],
        duplicatePositions: [],
        missingPositions: [0],
      });
    }
  });

  test('throws when a category position is duplicated', () => {
    const categories: Category[] = [
      { id: 'category-1', menuVersionId: 'menu-version-1', position: 0, displayName: 'Category 1' },
      { id: 'category-2', menuVersionId: 'menu-version-1', position: 1, displayName: 'Category 2' },
      { id: 'category-3', menuVersionId: 'menu-version-1', position: 1, displayName: 'Category 3' },
    ];

    try {
      requireContiguousCategoryOrder(categories);
      throw new Error('expected function to throw');
    } catch (err) {
      expectCategoryOrderingViolation(err, {
        menuVersionIds: ['menu-version-1'],
        categoryCount: 3,
        positions: [0, 1, 1],
        duplicatePositions: [1],
        missingPositions: [2],
      });
    }
  });

  test('throws when a category position is skipped', () => {
    const categories: Category[] = [
      { id: 'category-1', menuVersionId: 'menu-version-1', position: 0, displayName: 'Category 1' },
      { id: 'category-2', menuVersionId: 'menu-version-1', position: 2, displayName: 'Category 2' },
      { id: 'category-3', menuVersionId: 'menu-version-1', position: 3, displayName: 'Category 3' },
    ];

    try {
      requireContiguousCategoryOrder(categories);
      throw new Error('expected function to throw');
    } catch (err) {
      expectCategoryOrderingViolation(err, {
        menuVersionIds: ['menu-version-1'],
        categoryCount: 3,
        positions: [0, 2, 3],
        duplicatePositions: [],
        missingPositions: [1],
      });
    }
  });

  test('throws when categories from multiple menu versions are mixed', () => {
    const categories: Category[] = [
      { id: 'category-1', menuVersionId: 'menu-version-1', position: 0, displayName: 'Category 1' },
      { id: 'category-2', menuVersionId: 'menu-version-1', position: 1, displayName: 'Category 2' },
      { id: 'category-3', menuVersionId: 'menu-version-2', position: 2, displayName: 'Category 3' },
    ];

    try {
      requireContiguousCategoryOrder(categories);
      throw new Error('expected function to throw');
    } catch (err) {
      expectCategoryOrderingViolation(err, {
        menuVersionIds: ['menu-version-1', 'menu-version-2'],
        categoryCount: 3,
        positions: [0, 1, 2],
        duplicatePositions: [],
        missingPositions: [],
      });
    }
  });

  test('returns an empty category list when no categories exist', () => {
    const categories: Category[] = [];

    const result = requireContiguousCategoryOrder(categories);

    expect(result).toBe(categories);
  });
});
