import type { Category } from '@domain/category/Category';
import type { CreateCategoryInput } from '@domain/category/CreateCategoryInput';

export interface CategoryRepository {
  createCategory(input: CreateCategoryInput): Promise<Category>;
  listByMenuVersionId(menuVersionId: string): Promise<Category[]>;
}
