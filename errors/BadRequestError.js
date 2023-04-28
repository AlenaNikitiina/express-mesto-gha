const { BAD_REQUEST } = require('./errors_constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = NotFoundError;
