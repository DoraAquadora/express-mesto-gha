const router = require('express').Router();
const statusErr = require('../codes/status');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(statusErr.NotFound)
    .send({ message: '404: Страница не найдена.' });
});

module.exports = router;
