import { InvalidCategoryDisplayNameError } from '@domain/category/InvalidCategoryDisplayNameError';
import { requireContiguousCategoryOrder } from '@domain/category/requireContiguousCategoryOrder';
import { getDraftWorkspace } from '@domain/menu-version/getDraftWorkspace';

import type { Audience } from '@domain/Audience';
import type { Category } from '@domain/category/Category';
import type { CategoryRepository } from '@domain/category/repositories/CategoryRepository';
import type { MenuVersionRepository } from '@domain/menu-version/repositories/MenuVersionRepository';

export async function createCategoryInDraftWorkspace(
  audience: Audience,
  categoryRepository: CategoryRepository,
  menuVersionRepository: MenuVersionRepository,
  displayName: string
): Promise<Category> {
  const normalizedDisplayName = displayName.trim();

  if (normalizedDisplayName.length === 0) {
    throw new InvalidCategoryDisplayNameError({ reason: 'empty_after_trim' });
  }

  const draftMenuVersion = await getDraftWorkspace(audience, menuVersionRepository);
  const draftCategories = await categoryRepository.listByMenuVersionId(draftMenuVersion.id);

  requireContiguousCategoryOrder(draftCategories);

  const category = await categoryRepository.createCategory({
    menuVersionId: draftMenuVersion.id,
    position: draftCategories.length,
    displayName: normalizedDisplayName,
  });

  return category;
}
