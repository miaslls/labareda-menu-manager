import { db } from '@/app/lib/db';

import type { MenuVersion } from '@domain/menu-version/MenuVersion';
import type { MenuVersionRepository } from '@domain/menu-version/repositories/MenuVersionRepository';

import { mapPrismaStatusToDomain } from '@persistence/menu-version/mapStatus';

export class PrismaMenuVersionRepository implements MenuVersionRepository {
  async listAll(): Promise<MenuVersion[]> {
    const records = await db.menuVersion.findMany();

    return records.map((record) => ({
      id: record.id,
      status: mapPrismaStatusToDomain(record.status),
    }));
  }
}
