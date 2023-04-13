const User = require('../models/user'); // модель

// создаёт пользователя. post('/users', createUser)
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные 111', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 11' });
      }
    });
};

// возвращает пользователя по _id. get('/users/:id', getUser)
const getUser = (req, res) => {
  User.findById(req.params.userId)
    // .orFail(() => {
    // throw new Error('user not found');
    // })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные 222', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 22' });
      }
    });
};

// возвращает всех пользователей. get('/users', getUsers)
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные 33', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 33' });
      }
    });
};

// обновляет аватар - PATCH /users/me/avatar
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => { throw new Error('user not found'); })
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные 33', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 33' });
      }
    });
};

// обновляет профиль PATCH /users/me
const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { throw new Error('user not found'); })
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные 33', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 33' });
      }
    });
};

module.exports = {
  createUser, getUser, getUsers, updateUserAvatar, updateUser,
};
