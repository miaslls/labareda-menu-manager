import type { MenuVersion } from '../MenuVersion';

export interface MenuVersionRepository {
  createDraft(): Promise<MenuVersion>;
  listAll(): Promise<MenuVersion[]>;
}
