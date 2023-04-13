const Card = require('../models/card');

// GET /cards — возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// POST /cards — создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные 222', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 22' });
      }
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCards = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('user not found');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные 222', error });
      } else {
        res.status(500).send({ message: 'Произошла ошибка 22' });
      }
    });
};

module.exports = { getCards, createCard, deleteCards };
