const Card = require('../models/card'); // модель
const { BAD_REQUEST, INTERNAL_SERVERE_ERROR, NOT_FOUND } = require('../errors/errors_constants'); // errors

// создаёт карточку.  POST /cards
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
    });
};

// возвращает все карточки.  GET /cards
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => {
      res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка.', error });
    });
};

// поставить лайк карточке.  PUT /cards/:cardId/likes
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Пользователь с некорректным id');
      error.statusCode = 404;
      return error;
    })
    .then((card) => {
      res.send(card); // res.send({ data: card })
    })
    .catch((error) => {
      console.log("error name: '", error.name, error.statusCode);
      console.log(error.name === 'CastError');
      console.log(error.name === 'ValidationError');
      console.log(error.name === 'Пользователь с некорректным id');

      if (error.statusCode === 400 || error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.', error });
      } else if (error.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Добавление лайка с некорректным id карточки', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
    });
};

// убрать лайк с карточки.  DELETE /cards/:cardId/likes
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Пользователь с некорректным id');
      error.statusCode = 404;
      return error;
    })
    .then((like) => res.send({ data: like }))
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при снятии лайка.', error });
      } else if (error.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Удаление лайка у карточки с некорректным id', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
    });
};

// удаляет карточку по идентификатору.  DELETE /cards/:cardId
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('Пользователь с некорректным id');
      error.statusCode = 404;
      return error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена.', error });
      } else if (error.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Удаление карточки с некорректным id', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'На сервере произошла ошибка', error });
      }
    });
};

module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
