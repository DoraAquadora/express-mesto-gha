/* экспортируем модель со схемой в контроллер */
const Card = require('../models/card');
const myError = require('../errors/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id, // используем req.user
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new myError.BadRequestError(myError.BadRequestMsg));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;

  Card.findByIdAndRemove({ _id: req.params.cardId })
    .orFail(() => new myError.NotFoundError(myError.NotFoundMsg))
    .then((card) => {
      if (!card) {
        return next(new myError.NotFoundError(myError.NotFoundMsg));
      }
      if (card.owner.toHexString() !== (owner)) {
        return next(new myError.ForbiddenError(myError.ForbiddenMsg));
      }
      return res.send({ message: 'Удалено успешно' });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: _id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => new myError.NotFoundError(myError.NotFoundMsg))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: _id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => new myError.NotFoundError(myError.NotFoundMsg))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
