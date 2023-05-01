const bcrypt = require('bcryptjs'); // импортируем модуль bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken

const User = require('../models/user'); // модель
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const ConflictError = require('../errors/ConflictError'); // 409
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const { JWT_SECRET } = require('../config');

// создаёт пользователя.  POST('/users', createUser) содержит body
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу. преобразование данных в строку
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (error.code === 11000 || error.name === 'MongoServerError') {
        next(new ConflictError('Пользователь с такими данными уже существует.'));
      } else {
        next(error);
      }
    });
};

// возвращает текущего пользователя  GET('users/me')
const getCurrentUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// возвращает пользователя по _id.  GET('/users/:id', getUser)
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new NotFoundError('Пользователь с некорректным id');
      return error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному _id не найден.'));
      } else {
        next(error);
      }
    });
};

// возвращает всех пользователей.  GET('/users', getUsers)
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// обновляет аватар.  PATCH /users/me/avatar
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с некорректным id');
    })
    .then((user) => {
      res.status(200).send(user); // send({ data: users }))
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(error);
      }
    });
};

// обновляет профиль.  PATCH /users/me
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с некорректным id');
    })
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      // console.log("name error:", error.name, ", code:", error.statusCode);
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(error);
      }
    });
};

// Создаём контроллер аутентификации
// Если почта и пароль совпадают с теми, что есть в базе, чел входит на сайт
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }); // создадим токен
      res.send({ token }); // аутентификация успешна
    })
    .catch(() => {
      next(new UnauthorizedError('Необходима авторизация')); // неправильных почте и пароле
    });
};

//
module.exports = {
  createUser, getUser, getUsers, updateUserAvatar, updateUser, login, getCurrentUserMe,
};
