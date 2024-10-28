export class VersionControlError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'VersionControlError';
    Object.setPrototypeOf(this, VersionControlError.prototype);
  }

  static notFound(resource: string): VersionControlError {
    return new VersionControlError(
      `${resource} not found`,
      'RESOURCE_NOT_FOUND'
    );
  }

  static unauthorized(message = 'Unauthorized'): VersionControlError {
    return new VersionControlError(
      message,
      'UNAUTHORIZED'
    );
  }

  static invalidOperation(message: string): VersionControlError {
    return new VersionControlError(
      message,
      'INVALID_OPERATION'
    );
  }

  static gitError(message: string, details?: any): VersionControlError {
    return new VersionControlError(
      message,
      'GIT_ERROR',
      details
    );
  }

  static validationError(message: string, details?: any): VersionControlError {
    return new VersionControlError(
      message,
      'VALIDATION_ERROR',
      details
    );
  }
}
