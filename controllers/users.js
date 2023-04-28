const bcrypt = require('bcryptjs'); // импортируем модуль bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken

const User = require('../models/user'); // модель
const { BAD_REQUEST, INTERNAL_SERVERE_ERROR, NOT_FOUND } = require('../errors/errors_constants'); // errors
// const { JWT_SECRET } = require('../config');

// создаёт пользователя.  POST('/users', createUser) содержит body
const createUser = (req, res) => {
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
        // _id: user._id,
      });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.', error });
      } else if (error.code === 11000 || error.name === 'MongoServerError') {
        // console.log(error.name);
        // console.log(error.statusCode);
        res.status(409).send({ message: 'Пользователь с такими данными уже существует', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
      // next(error) так напимат при глобальн обработке
    });
};

// возвращает текущего пользователя  GET('users/me')
const getCurrentUserMe = (req, res, next) => {
  console.log('me1');
  const id = req.user._id;
  console.log('me1', id);

  User.findById(id)
    .orFail(() => {
      throw new Error('meme');
    })
    .then((user) => {
      // console.log('me2');
      res.send(user);
    })
    .catch(next);
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
        res.status(BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден.in getUser getCurrentUserMe', error });
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
    .then((user) => {
      res.status(200).send(user); // .then((users) => res.send({ data: users }))
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

// Создаём контроллер аутентификации
// Если почта и пароль совпадают с теми, что есть в базе, чел входит на сайт
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'JWTSECRET', { expiresIn: '7d' }); // создадим токен
      res.send({ token }); // аутентификация успешна
    })
    .catch((error) => {
      res.status(401).send({ message: error.message }); // 403 ? неправильных почте и пароле
    });
};

//
module.exports = {
  createUser, getUser, getUsers, updateUserAvatar, updateUser, login, getCurrentUserMe,
};

//
/* было до
// Создаём контроллер аутентификации
const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // пользователь не найден — отклоняем промис. с ошибкой и переходим в catch
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // Если польз найден, проверим пароль: захешируем его и сравним с хешем в базе.
      // принимает на вход пароль,его хеш. Метод посчитает хеш и сравнит его с тем хешем,
      // который мы передали вторым аргументом:
      // сравниваем переданный пароль и хеш из базы. acync
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
        //хешине совпали — отклоняем промис
      }
      // 500.catch
      res.send({ message: 'Всё верно!' }); // аутентификация успешна
    })
    .catch((error) => {
      res.status(401).send({ message: error.message });
    });
};
*/
