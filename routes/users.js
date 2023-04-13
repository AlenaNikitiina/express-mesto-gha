// это файл маршрутa user, сюда приходят запросы от пользователей
const usersRouter = require('express').Router(); // создали роутер
const { createUser, getUser, getUsers } = require('../controllers/users');

//
usersRouter.get('/users', getUsers); // возвращает всех пользователей. это ф контроллеры она идет в базу данных и возвр челу результат
usersRouter.get('/users/:id', getUser); // возвращает пользователя по _id
usersRouter.post('/users', createUser); // создаёт пользователя

module.exports = usersRouter;
