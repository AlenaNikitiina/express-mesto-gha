const User = require('../models/user'); // модель
const { BAD_REQUEST, INTERNAL_SERVERE_ERROR, NOT_FOUND } = require('../errors/errors_constants'); // errors

// создаёт пользователя.  POST('/users', createUser)
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
    });
};

// возвращает пользователя по _id.  GET('/users/:id', getUser)
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('Пользователь с некорректным id');
      error.statusCode = 404;
      return error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден.', error });
      } else if (error.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Получение пользователя с некорректным id', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
    });
};

// возвращает всех пользователей.  GET('/users', getUsers)
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
    });
};

// обновляет аватар.  PATCH /users/me/avatar
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { throw new Error('user not found'); }) // метод moongose
    // .then((users) => res.send({ data: users }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: ' Переданы некорректные данные при обновлении аватара.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка.', error });
      }
    });
};

// обновляет профиль.  PATCH /users/me
const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { throw new Error('user not found'); })
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      // console.log("name error:", error.name, ", code:", error.statusCode);
      if (error.statusCode === 400 || error.name === 'CastError' || error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
    });
};

module.exports = {
  createUser, getUser, getUsers, updateUserAvatar, updateUser,
};
