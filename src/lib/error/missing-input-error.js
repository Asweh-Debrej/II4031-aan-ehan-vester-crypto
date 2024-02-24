export default class MissingInputError extends Error {
  constructor(message, name, errors = []) {
    super(message);
    this.name = name;
    this.errors = errors; // [ { field: "text", message: "Text is required" } ]
  }
}
