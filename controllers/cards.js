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


}

module.exports = { getCards, createCard };
