const Card = require('../models/card'); // модель
const { BAD_REQUEST, INTERNAL_SERVERE_ERROR } = require('../errors/errors_constants'); // errors

// POST /cards — создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// GET /cards — возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => {
      res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Переданы некорректные данные при возврате карточки.', error });
    });
};

// поставить лайк карточке - PUT /cards/:cardId/likes
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    // .orFail(() => { throw new Error('user not found'); })
    .then((card) => {
      res.send(card); // res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

// убрать лайк с карточки  DELETE /cards/:cardId/likes
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    // .orFail(() => { throw new Error('user not found'); })
    .then((like) => res.send({ data: like }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при снятии лайка.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Произошла ошибка 22' });
      }
    });
};

// удаляет карточку по идентификатору  DELETE /cards/:cardId
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    // .orFail(() => { throw new Error('user not found'); })
    .then((card) => res.status(200).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена.', error });
      } else {
        res.status(INTERNAL_SERVERE_ERROR).send({ message: 'Произошла ошибка 22' });
      }
    });
};

module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
