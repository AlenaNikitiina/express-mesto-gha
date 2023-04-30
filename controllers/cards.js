const Card = require('../models/card'); // модель

const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400

// создаёт карточку.  POST /cards
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(error);
      }
    });
};

// возвращает все карточки.  GET /cards
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => {
      next(error);
    });
};

// поставить лайк карточке.  PUT /cards/:cardId/likes
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь с некорректным id');
    })
    .then((card) => {
      res.send(card); // send({ data: card })
    })
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Добавление лайка с некорректным id карточки'));
      } else {
        next(error);
      }
    });
};

// убрать лайк с карточки.  DELETE /cards/:cardId/likes
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь с некорректным id');
    })
    .then((like) => res.send({ data: like }))
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при снятии лайка.'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Удаление лайка у карточки с некорректным id'));
      } else {
        next(error);
      }
    });
};

// удаляет карточку по идентификатору.  DELETE /cards/:cardId
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('Чужую карточку нельзя удалитьssss');
      error.statusCode = 403;
      return error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена.'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Удаление карточки с некорректным id'));
      } else if (error.statusCode === 403) {
        res.status(403).send({ message: 'Чужую карточку нельзя sssудалить' });
      } else {
        next(error);
      }
    });
};

/* old
// удаляет карточку по идентификатору.  DELETE /cards/:cardId
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с некорректным id');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((error) => {
      if (error.statusCode === 400 || error.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена.'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Удаление карточки с некорректным id'));
      } else {
        next(error);
      }
    });
};
*/
module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
