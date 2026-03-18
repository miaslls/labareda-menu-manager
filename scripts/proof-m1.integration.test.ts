import 'dotenv/config';
import { afterAll, describe, expect, test } from 'vitest';

import { MenuVersionStatus } from '@/generated/prisma/enums';
import { AUDIENCE } from '@domain/Audience';
import { ensureDraftWorkspace } from '@domain/menu-version/ensureDraftWorkspace';
import { getDraftWorkspace } from '@domain/menu-version/getDraftWorkspace';
import { PrismaMenuVersionRepository } from '@persistence/menu-version/PrismaMenuVersionRepository';
import { db } from '@lib/db';

describe('Milestone 1 proof runner', () => {
  const repo = new PrismaMenuVersionRepository();

  afterAll(async () => {
    await db.$disconnect();
  });

  test('proves clean DB bootstrap and deterministic draft retrieval', async () => {
    const rowsBefore = await db.menuVersion.findMany();
    expect(rowsBefore).toHaveLength(0);

    const firstDraft = await ensureDraftWorkspace(repo);
    const secondDraft = await ensureDraftWorkspace(repo);
    const adminDraft = await getDraftWorkspace(AUDIENCE.ADMIN_EDIT, repo);

    const rowsAfter = await db.menuVersion.findMany();
    const draftRows = rowsAfter.filter((row) => row.status === MenuVersionStatus.DRAFT);

    expect(rowsAfter).toHaveLength(1);
    expect(draftRows).toHaveLength(1);
    expect(firstDraft.id).toBe(secondDraft.id);
    expect(firstDraft.id).toBe(adminDraft.id);

    console.log(`[M1-PROOF] PASS draftId=${firstDraft.id} rowCount=${rowsAfter.length}`);
  });
});
