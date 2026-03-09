import { MenuVersionStatus } from '@domain/menu-version/MenuVersionStatus';

export interface MenuVersion {
  id: string;
  status: MenuVersionStatus;
}
