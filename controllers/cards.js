const { ValidationError } = require('mongoose').Error;
const { CastError } = require('mongoose').Error;
const Card = require('../models/card');
const statusErr = require('../codes/status');

const ForbiddenError = require('../codes/errors/ForbiddenError');
const NotFoundError = require('../codes/errors/NotFoundError');
const BadRequestError = require('../codes/errors/BadRequestError');

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card
    .create({ name, link, owner: userId })
    .then((card) => res.status(statusErr.Created).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new BadRequestError(
            'неверные данные',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card
    .findById({
      _id: cardId,
    })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('не найдено');
      }

      const { owner: cardOwnerId } = card;

      if (cardOwnerId.valueOf() !== userId) {
        throw new ForbiddenError('без доступа');
      }

      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('не найдено');
      }

      res.send({ data: deletedCard });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $addToSet: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError('Не найдено');
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(
          new BadRequestError(
            'Неверные данные',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card
    .findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: userId,
        },
      },
      {
        new: true,
      },
    )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError('не найдено');
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(
          new BadRequestError(
            'Неверные данные',
          ),
        );
      } else {
        next(err);
      }
    });
};
