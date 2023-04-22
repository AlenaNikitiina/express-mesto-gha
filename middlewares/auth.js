const jwt = require('jsonwebtoken');

// Если предоставлен верный токен, запрос проходит на дальнейшую обработку.
// Иначе запрос переходит контроллеру, кот возвр клиенту сообщение об ошибке.

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  // Если токен на месте,извлечём его. вызовем м replace, чтоб выкинуть из заголовка приставкуBearer
  const token = authorization.replace('Bearer ', ''); // Таким образом, в переменную token запишется только JWT.
  let payload;

  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, 'some-secret-key'); // ////////////////////////////////////////////////
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' }); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next();
};
