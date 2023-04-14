const cardsRouter = require('express').Router(); // создали роутер

const {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

cardsRouter.post('/cards', createCard); // создаёт карточку
cardsRouter.get('/cards', getCards); // возвращает все карточки
cardsRouter.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору

cardsRouter.put('/cards/:cardId/likes', likeCard); // поставить лайк
cardsRouter.delete('/cards/:cardId/likes', dislikeCard); // убрать лайк

module.exports = cardsRouter;
