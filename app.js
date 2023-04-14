// импортируем
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NOT_FOUND = require('./errors/errors_constants');

//
const app = express(); // создаем приложение
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '643862b78194099cf145b31a', // _id созданного юзера
  };
  next();
});

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

// Здесь роутинг :
app.use('/', usersRouter); // запускаем. передали ф своим обработчикам запроса
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Несуществующая страница' });
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));

//
app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
