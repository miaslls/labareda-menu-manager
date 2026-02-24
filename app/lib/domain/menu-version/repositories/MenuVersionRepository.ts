import type { MenuVersion } from '../MenuVersion';

export interface MenuVersionRepository {
  listAll(): Promise<MenuVersion[]>;
}
