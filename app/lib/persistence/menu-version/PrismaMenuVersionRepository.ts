import { MenuVersionStatus } from '@/generated/prisma/enums';
import { mapPrismaStatusToDomain } from '@persistence/menu-version/mapStatus';
import { db } from '@lib/db';

import type { MenuVersion } from '@domain/menu-version/MenuVersion';
import type { MenuVersionRepository } from '@domain/menu-version/repositories/MenuVersionRepository';

export class PrismaMenuVersionRepository implements MenuVersionRepository {
  async listAll(): Promise<MenuVersion[]> {
    const records = await db.menuVersion.findMany();

    return records.map((record) => ({
      id: record.id,
      status: mapPrismaStatusToDomain(record.status),
    }));
  }

  async createDraft(): Promise<MenuVersion> {
    const record = await db.menuVersion.create({ data: { status: MenuVersionStatus.DRAFT } });

    return {
      id: record.id,
      status: mapPrismaStatusToDomain(record.status),
    };
  }
}
