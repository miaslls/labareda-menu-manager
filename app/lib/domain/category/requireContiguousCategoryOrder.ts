import { CategoryOrderingInvariantViolationError } from '@domain/category/CategoryOrderingInvariantViolationError';

import type { Category } from '@domain/category/Category';

export function requireContiguousCategoryOrder(categories: Category[]): Category[] {
  const menuVersionIds = [...new Set(categories.map((category) => category.menuVersionId))];
  const positions = categories.map((category) => category.position);
  const duplicatePositions = findDuplicatePositions(positions);
  const missingPositions = findMissingPositions(positions, categories.length);

  if (menuVersionIds.length > 1 || duplicatePositions.length > 0 || missingPositions.length > 0) {
    throw new CategoryOrderingInvariantViolationError({
      menuVersionIds,
      categoryCount: categories.length,
      positions,
      duplicatePositions,
      missingPositions,
    });
  }

  return categories;
}

function findDuplicatePositions(positions: number[]): number[] {
  const seenPositions = new Set<number>();
  const duplicatePositions = new Set<number>();

  for (const position of positions) {
    if (seenPositions.has(position)) {
      duplicatePositions.add(position);
    }

    seenPositions.add(position);
  }

  return [...duplicatePositions];
}

function findMissingPositions(positions: number[], categoryCount: number): number[] {
  const actualPositions = new Set(positions);
  const missingPositions: number[] = [];

  for (let expectedPosition = 0; expectedPosition < categoryCount; expectedPosition++) {
    if (!actualPositions.has(expectedPosition)) {
      missingPositions.push(expectedPosition);
    }
  }

  return missingPositions;
}
