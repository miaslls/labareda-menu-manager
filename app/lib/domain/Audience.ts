export const AUDIENCE = {
  PUBLIC: 'public',
  ADMIN_PREVIEW: 'adminPreview',
  ADMIN_EDIT: 'adminEdit',
} as const;

export type Audience = (typeof AUDIENCE)[keyof typeof AUDIENCE];
