import { getPrismaClient } from '@lib/db/prisma-client';

import type { Category } from '@domain/category/Category';
import type { CreateCategoryInput } from '@domain/category/CreateCategoryInput';
import type { CategoryRepository } from '@domain/category/repositories/CategoryRepository';

const db = getPrismaClient();

export class PrismaCategoryRepository implements CategoryRepository {
  async listByMenuVersionId(menuVersionId: string): Promise<Category[]> {
    const records = await db.category.findMany({
      where: { menuVersionId },
      orderBy: { position: 'asc' },
    });

    return records.map((record) => ({
      id: record.id,
      menuVersionId: record.menuVersionId,
      displayName: record.displayName,
      position: record.position,
    }));
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const record = await db.category.create({ data: input });

    return {
      id: record.id,
      menuVersionId: record.menuVersionId,
      displayName: record.displayName,
      position: record.position,
    };
  }
}
