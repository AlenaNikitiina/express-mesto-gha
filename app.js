// импортируем
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { errors } = require('celebrate'); // будет обрабатывать ток ошибки, которые сгенерировал celebrate
const { PORT, SERVER_ADDRESS } = require('./config');

const router = require('./routes/index'); // тут все роуты
const handleErrors = require('./middlewares/handleErrors');

// создаем приложение
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router); // Здесь роутинг всех

app.use(errors()); // обработчик ошибок celebrate
app.use(handleErrors); // централизованный обработчик ошибок

// подключаемся к серверу mongo
mongoose.connect(SERVER_ADDRESS)
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));

//
app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
