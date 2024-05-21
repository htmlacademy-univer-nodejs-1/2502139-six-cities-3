export class HttpError extends Error {
  public httpStatusCode!: number;
  public detail?: Error[] = [];

  constructor(httpStatusCode: number, message: string, detail?: Error[]) {
    super(message);

    this.httpStatusCode = httpStatusCode;
    this.message = message;
    this.detail = detail;
  }
}
