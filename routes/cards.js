const cardsRouter = require('express').Router;
const { getCards, createCard, deleteCard } = require('../controllers/cards');

cardsRouter.get('/cards', getCards); // возвращает все карточки
cardsRouter.post('/cards', createCard); // создаёт карточку
cardsRouter.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору

module.exports = cardsRouter;
