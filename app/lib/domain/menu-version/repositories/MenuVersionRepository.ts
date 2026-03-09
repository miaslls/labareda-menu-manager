import type { MenuVersion } from '@domain/menu-version/MenuVersion';

export interface MenuVersionRepository {
  createDraft(): Promise<MenuVersion>;
  listAll(): Promise<MenuVersion[]>;
}
