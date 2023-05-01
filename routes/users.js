// это файл маршрутa user, сюда приходят запросы от пользователей
const usersRouter = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
// const URL_CHECK = require('../utils/isUrl');

const {
  getUser, getUsers, updateUserAvatar, updateUser, getCurrentUserMe,
} = require('../controllers/users');

// это ф контроллеры она идет в базу данных и возвр челу результат
usersRouter.get('/users', getUsers); // возвр всех пользователей.
usersRouter.get('/users/me', getCurrentUserMe); // роут возвращает инфу о текущем пользователе

// возвращает пользователя по _id
usersRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
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
