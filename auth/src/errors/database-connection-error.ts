export class DatabaseConnectionError extends Error {
  reason = 'error connecting to the database';
  constructor() {
    super();
    //Only because we are extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
