import { describe, expect, test } from 'vitest';

import type { Category } from '@domain/category/Category';
import type { CreateCategoryInput } from '@domain/category/CreateCategoryInput';
import type { CategoryRepository } from '@domain/category/repositories/CategoryRepository';

class FakeCategoryRepository implements CategoryRepository {
  private readonly categories: Category[];

  constructor(categories: Category[]) {
    this.categories = categories.map((category) => ({ ...category }));
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
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
}

describe('CategoryRepository contract', () => {
  test('creates and returns a category from domain input', async () => {
    const fakeRepo = new FakeCategoryRepository([]);

    const input: CreateCategoryInput = {
      menuVersionId: '001',
      displayName: 'Category A',
      position: 0,
    };

    const newCategory: Category = await fakeRepo.createCategory(input);

    expect(newCategory.id).toBeTypeOf('string');
    expect(newCategory.menuVersionId).toBe(input.menuVersionId);
    expect(newCategory.displayName).toBe(input.displayName);
    expect(newCategory.position).toBe(input.position);
  });

  test('lists only categories for the requested menu version', async () => {
    const initialCategories: Category[] = [
      { id: 'category-001-0', menuVersionId: '001', displayName: 'Category A', position: 0 },
      { id: 'category-002-0', menuVersionId: '002', displayName: 'Category B', position: 0 },
    ];

    const fakeRepo = new FakeCategoryRepository(initialCategories);

    const categories: Category[] = await fakeRepo.listByMenuVersionId('001');

    expect(categories).toHaveLength(1);
    expect(categories[0].id).toBe('category-001-0');
    expect(categories.every((category) => category.menuVersionId === '001')).toBe(true);
  });

  test('returns categories ordered by position', async () => {
    const initialCategories: Category[] = [
      { id: 'category-002-0', menuVersionId: '001', displayName: 'Category B', position: 1 },
      { id: 'category-003-0', menuVersionId: '001', displayName: 'Category C', position: 2 },
      { id: 'category-001-0', menuVersionId: '001', displayName: 'Category A', position: 0 },
    ];

    const fakeRepo = new FakeCategoryRepository(initialCategories);

    const categories: Category[] = await fakeRepo.listByMenuVersionId('001');

    expect(categories).toHaveLength(3);
    expect(categories[0].position).toBe(0);
    expect(categories[1].position).toBe(1);
    expect(categories[2].position).toBe(2);
  });
});
