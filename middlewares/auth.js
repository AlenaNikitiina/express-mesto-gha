const jwt = require('jsonwebtoken');

// const { JWT_SECRET } = process.env;

// Если предоставлен верный токен, запрос проходит на дальнейшую обработку.
// Иначе запрос переходит контроллеру, кот возвр клиенту сообщение об ошибке.

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' }); // no
  }

  // Если токен на месте,Извлечём его. вызовем м replace, чтоб выкинуть из заголовка приставкуBearer
  const token = authorization.replace('Bearer ', ''); // Таким образом, в переменную token запишется только JWT.
  let payload;

  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, 'JWTSECRET'); // получилось
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' }); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
