const router = require('express').Router(); // общий обработчик
const userRouter = require('./users');

router.use('/users', userRouter); //  следит ток за юзерами

// router.use('/cars', cardsRouter );
module.exports = router;
