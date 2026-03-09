export type NotImplementedMeta = {
  module: string; // file or logical module where the stub lives
  symbol: string; // method/function/class member not implemented
  plannedIn?: string; // milestone or ticket reference
};

export class NotImplementedError extends Error {
  readonly meta: NotImplementedMeta;
  readonly code = 'NOT_IMPLEMENTED';

  constructor(meta: NotImplementedMeta) {
    super(`Not implemented: ${meta.symbol}`);

    this.name = 'NotImplementedError';
    this.meta = meta;
  }
}
