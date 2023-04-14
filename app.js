// импортируем
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

// //
const app = express(); // создаем приложение
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '643862b78194099cf145b31a',
  };
  next();
});

// // Здесь роутинг :
app.use('/', usersRouter); // запускаем. передали ф своим обработчикам запроса
app.use('/', cardsRouter);

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));
//
app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
