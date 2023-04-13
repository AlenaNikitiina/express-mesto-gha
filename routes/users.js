// это файл маршрутa user, сюда приходят запросы от пользователей
const usersRouter = require('express').Router(); // создали роутер
const { createUser, getUser, getUsers, updateUserAvatar, updateUser } = require('../controllers/users');

//
usersRouter.get('/users', getUsers); // возвращает всех пользователей. это ф контроллеры она идет в базу данных и возвр челу результат
usersRouter.get('/users/:userId', getUser); // возвращает пользователя по _id
usersRouter.post('/users', createUser); // создаёт пользователя

usersRouter.patch('/users/me', updateUser); // обновляет профиль
usersRouter.patch('/users/me/avatar', updateUserAvatar); // обновляет аватар

module.exports = usersRouter;
