// импортируем
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');
// const mongoose = require('mongoose');

const PORT = 3000; //
const app = express(); // создаем приложение

// mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

// экпрересс при гет запросе на /выполнит колбэк
app.get('/', (req, res) => {
  res.send('hi');
});

// запускаем сервер
app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`); // `Ссылка на сервер: ${PORT}`
});
