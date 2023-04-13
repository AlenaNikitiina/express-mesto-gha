const cardsRouter = require('express').Router;
const { getCards, createCard, deleteCards } = require('../controllers/cards');

cardsRouter.get('/cards', getCards); // возвращает все карточки
cardsRouter.post('/cards', createCard); // создаёт карточку
cardsRouter.delete('/cards/:cardId', deleteCards); // удаляет карточку по идентификатору

// cardsRouter.put('/cards/:cardId/likes', putLikes); // поставить лайк
// cardsRouter.delete('/cards/:cardId/likes', deleteLikes); // убрать лайк

module.exports = cardsRouter;
