import type { MenuVersionStatus } from '@domain/menu-version/MenuVersionStatus';
import { MenuVersionStatus as PrismaMenuVersionStatus } from '@/generated/prisma/client';

function assertNever(x: never): never {
  throw new Error(`Unhandled status: ${String(x)}`);
}

export function mapPrismaStatusToDomain(status: PrismaMenuVersionStatus): MenuVersionStatus {
  switch (status) {
    case PrismaMenuVersionStatus.DRAFT:
      return 'DRAFT';
    case PrismaMenuVersionStatus.PUBLISHED:
      return 'PUBLISHED';
    case PrismaMenuVersionStatus.REPLACED:
      return 'REPLACED';
    default:
      return assertNever(status);
  }
}
