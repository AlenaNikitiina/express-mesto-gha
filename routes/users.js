// это файл маршрутa user, сюда приходят запросы от пользователей
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('express').Router(); // создали роутер

const {
  getUser, getUsers, updateUserAvatar, updateUser, getCurrentUserMe,
} = require('../controllers/users');

// это ф контроллеры она идет в базу данных и возвр челу результат
usersRouter.get('/users', getUsers); // возвр всех пользователей.
usersRouter.get('/users/me', getCurrentUserMe); // роут возвращает инфу о текущем пользователе

// возвращает пользователя по _id
usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUser);

// обновляет профиль
usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

// обновляет аватар
usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/),
  }),
}), updateUserAvatar);

module.exports = usersRouter;

/* old
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
*/
