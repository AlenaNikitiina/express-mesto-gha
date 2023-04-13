const User = require('../models/user'); // модель

// создаёт пользователя. POST
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

// возвращает пользователя по _id. GET
const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('user not found');
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные 222', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 22' });
      }
    });
};

// возвращает всех пользователей. GET
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      res.status(500).send(error);
    });
};

module.exports = { createUser, getUser, getUsers };
