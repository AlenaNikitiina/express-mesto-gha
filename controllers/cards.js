const Card = require('../models/card');

// POST /cards — создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// GET /cards — возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
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
        res.status(400).send({ message: 'Переданы некорректные данные', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
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
        res.status(400).send({ message: 'Переданы некорректные данные 222', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 22' });
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
        res.status(400).send({ message: 'Переданы некорректные данные 222', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 22' });
      }
    });
};

module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
