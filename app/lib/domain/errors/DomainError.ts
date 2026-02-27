export type DomainErrorMeta = Record<string, unknown>;

export class DomainError<TMeta extends DomainErrorMeta = DomainErrorMeta> extends Error {
  readonly code: string;
  readonly meta: TMeta;

  constructor(code: string, message: string, meta: TMeta) {
    super(message);

    this.name = 'DomainError';
    this.code = code;
    this.meta = meta;
  }
}
