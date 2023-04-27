// импортируем
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT, SERVER_ADDRESS } = require('./config');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { createUser, login, getCurrentUserMe } = require('./controllers/users');
const auth = require('./middlewares/auth');

// const escape = require('escape-html');

// создаем приложение
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* // временное решение авторизации
app.use((req, res, next) => {
  req.user = {_id: '643862b78194099cf145b31a',};
  next();
});
*/

// Здесь роутинг :
app.use('/', auth, usersRouter); // запускаем. передали ф своим обработчикам запроса
app.use('/', auth, cardsRouter);
app.post('/signin', login); // роут для логина
app.post('/signup', createUser); // роут для регистрации
app.get('/me', getCurrentUserMe); // роут возвращает инфу о текущем пользователе

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
