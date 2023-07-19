const cardsRouter = require('express').Router();
const { celebrate } = require('celebrate');

const {
  validateCards,
  validateCardId,
} = require('../utils/validators');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate(validateCards), createCard);
cardsRouter.delete('/:cardId', celebrate(validateCardId), deleteCard);
cardsRouter.put('/:cardId/likes', celebrate(validateCardId), likeCard);
cardsRouter.delete('/:cardId/likes', celebrate(validateCardId), dislikeCard);

module.exports = cardsRouter;
