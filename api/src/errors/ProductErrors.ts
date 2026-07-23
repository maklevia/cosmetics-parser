export class DuplicateProductError extends Error {
  constructor(message: string = "User has product in this") {
    super(message);
    this.name = "DuplicateProductError";
  }
}

export class InvalidParseData extends Error {
  constructor(message: string = "Parsed results are invalid") {
    super(message);
    this.name = "InvalidParseData";
  }
}
