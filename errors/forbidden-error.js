const ForbiddenMsg = 'Нет доступа';

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = { ForbiddenError, ForbiddenMsg };
