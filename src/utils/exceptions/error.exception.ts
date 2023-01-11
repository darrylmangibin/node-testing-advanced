class ErrorException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    errorObject?: Record<string, unknown>
  ) {
    super(message);
  }
}

export default ErrorException;
