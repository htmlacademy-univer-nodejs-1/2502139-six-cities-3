
export function createErrorObject(message: string, errors?: unknown[]) {
  return {
    message,
    errors: errors || []
  };
}
