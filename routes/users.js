// это файл маршрутa user, сюда приходят запросы от пользователей
const usersRouter = require('express').Router(); // создали роутер

const {
  getUser, getUsers, updateUserAvatar, updateUser, getCurrentUserMe,
} = require('../controllers/users');

// это ф контроллеры она идет в базу данных и возвр челу результат
usersRouter.get('/users', getUsers); // возвр всех пользователей.
usersRouter.get('/users/me', getCurrentUserMe); // роут возвращает инфу о текущем пользователе
usersRouter.get('/users/:userId', getUser); // возвращает пользователя по _id

usersRouter.patch('/users/me', updateUser); // обновляет профиль
usersRouter.patch('/users/me/avatar', updateUserAvatar); // обновляет аватар

module.exports = usersRouter;
