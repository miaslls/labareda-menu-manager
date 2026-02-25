export type DomainErrorMeta = Record<string, unknown>;

export class DomainError extends Error {
  readonly code: string;
  readonly meta: DomainErrorMeta;

  constructor(code: string, message: string, meta: DomainErrorMeta = {}) {
    super(message);

    this.name = 'DomainError';
    this.code = code;
    this.meta = meta;
  }
}
