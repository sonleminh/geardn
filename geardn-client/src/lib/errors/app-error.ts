export class AppError extends Error {
  status?: number;
  details?: unknown;
  constructor(message: string, opts?: { status?: number; details?: unknown; cause?: unknown }) {
    super(message);
    this.name = 'AppError';
    this.status = opts?.status;
    this.details = opts?.details;
    this.cause = opts?.cause;
  }
  static fromUnknown(err: unknown): AppError {
    if (err instanceof AppError) return err;
    if (err instanceof Error) return new AppError(err.message, { cause: err });
    return new AppError('Unexpected error', { details: err });
  }
}
