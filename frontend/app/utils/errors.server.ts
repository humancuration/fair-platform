export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export function handleError(error: unknown) {
  if (error instanceof ValidationError) {
    return json({ error: error.message }, { status: 400 });
  }

  if (error instanceof AuthorizationError) {
    return json({ error: error.message }, { status: 401 });
  }

  if (error instanceof NotFoundError) {
    return json({ error: error.message }, { status: 404 });
  }

  console.error("Unexpected error:", error);
  return json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}
