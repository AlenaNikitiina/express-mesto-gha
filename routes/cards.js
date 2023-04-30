const { celebrate, Joi } = require('celebrate');

const cardsRouter = require('express').Router(); // создали роутер

const {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

// создаёт карточку
cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/),
  }),
}), createCard);

// возвращает все карточки
cardsRouter.get('/cards', getCards);

// удаляет карточку по идентификатору
cardsRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

// поставить лайк
cardsRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

// убрать лайк
cardsRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardsRouter;

/*
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
*/
