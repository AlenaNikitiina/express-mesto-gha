// импортируем
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT, SERVER_ADDRESS } = require('./config');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
// const escape = require('escape-html');

// создаем приложение
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '643862b78194099cf145b31a', // _id созданного мной юзера
  };
  next();
});

// Здесь роутинг :
app.use('/', usersRouter); // запускаем. передали ф своим обработчикам запроса
app.use('/', cardsRouter);

// app.post('/signin', login); // роут для логина
// app.post('/signup', createUser); // роут для регистрации

app.use((req, res) => {
  res.status(404).send({ message: 'Несуществующая страница.' });
});

// подключаемся к серверу mongo
mongoose.connect(SERVER_ADDRESS)
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));

//
app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
