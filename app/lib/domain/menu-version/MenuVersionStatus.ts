export const MENU_VERSION_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  REPLACED: 'REPLACED',
} as const;

export type MenuVersionStatus = (typeof MENU_VERSION_STATUS)[keyof typeof MENU_VERSION_STATUS];
