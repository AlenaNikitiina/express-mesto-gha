// импортируем
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate'); // ошибки библиотека для валидации данных
const { errors } = require('celebrate'); // ошибки
const { PORT, SERVER_ADDRESS } = require('./config');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
// const escape = require('escape-html');

// создаем приложение
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // Здесь роутинг :
// роут для логина
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

// роут для регистрации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/),
  }),
}), createUser);

// app.use(auth);// ??????
app.use('/', auth, usersRouter); // запускаем. передали ф своим обработчикам запроса
app.use('/', auth, cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Несуществующая страница.' });
});

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err; // если у ошибки нет статуса, выставляем 500
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500 ? 'На сервере произошла ошибка nnn' : message,
    });
  next();
});

// подключаемся к серверу mongo
mongoose.connect(SERVER_ADDRESS)
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));

//
app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
