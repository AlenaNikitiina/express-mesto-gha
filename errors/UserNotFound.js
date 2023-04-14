const AplicationError = require('./AplicationError');

class UserNotFound extends AplicationError {
  constructor() {
    super(404, 'Пользователь не найден');
  }
}

module.exports = UserNotFound;
