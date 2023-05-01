const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate'); // ошибки библиотека для валидации данных

const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError'); // 404

const usersRouter = require('./users');
const cardsRouter = require('./cards');

// // Здесь роутинг :
// роут для логина
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

// роут для регистрации
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/),
  }),
}), createUser);

router.use('/', auth, usersRouter); // запускаем. передали ф своим обработчикам запроса
router.use('/', auth, cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Несуществующая страница.'));
  // res.status(404).send({ message: 'Несуществующая страница.' });
});

module.exports = router;
