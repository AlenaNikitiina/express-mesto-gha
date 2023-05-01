const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

// Если предоставлен верный токен, запрос проходит на дальнейшую обработку.
// Иначе запрос переходит контроллеру, кот возвр клиенту сообщение об ошибке.

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация')); // no
  }

  // Если токен на месте,Извлечём его. вызовем м replace, чтоб выкинуть из заголовка приставкуBearer
  const token = authorization.replace('Bearer ', ''); // Таким образом, в переменную token запишется только JWT.
  let payload;

  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, JWT_SECRET); // получилось
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация')); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
