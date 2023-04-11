const usersRouter = require('express').Router(); // общий обработчик
const { createUser } = require('../controllers/users');

usersRouter.post('/', createUser); //  следит ток за юзерами

// router.use('/cars', cardsRouter );
module.exports = usersRouter;
