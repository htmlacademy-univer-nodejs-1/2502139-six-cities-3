
export function createErrorObject(message: string, errors: Error[]) {
  return {
    message,
    errors
  };
}
