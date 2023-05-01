// централизованный обработчик ошибок
const handleErrors = ((error, req, res, next) => {
  const { statusCode = 500, message } = error; // если у ошибки нет статуса, выставляем 500

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
});

module.exports = handleErrors;
