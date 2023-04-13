// импортируем
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
// const cardsRouter = require('./routes/cards');

// //
const app = express(); // создаем приложение
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // Здесь роутинг :
// экпрересс при гет запросе на / выполнит колбэк
// app.get('/', (req, res) => res.send('hi'));

app.use('/', usersRouter); // запускаем. передали ф своим обработчикам запроса
// app.use('/', cardsRouter);

// подключаемся к серверу mongo
// mongoose.connect('mongodb://localhost:27017/mestodb');
mongoose.connect('mongodb://127.0.0.1/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));
//
app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
