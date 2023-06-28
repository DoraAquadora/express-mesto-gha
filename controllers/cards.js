const Card = require('../models/card');
const statusErr = require('../helpers/status');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(statusErr.Success).send(cards))
    .catch(() => res
      .status(statusErr.InternalError)
      .send({ message: 'Произошла ошибка при запросе всех карточек' }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(statusErr.Success).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusErr.BadRequest).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(statusErr.InternalError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(statusErr.NotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(statusErr.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusErr.BadRequest).send({
          message: 'Переданы некорректные данные карточки.',
        });
      } else {
        res.status(statusErr.InternalError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(statusErr.NotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(statusErr.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(statusErr.BadRequest)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      }
      return res.status(statusErr.InternalError).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(statusErr.NotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(statusErr.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(statusErr.BadRequest)
          .send({
            message: 'Переданы некорректные данные для удаления лайка.',
          });
      }
      return res.status(statusErr.InternalError).send({ message: 'Ошибка по умолчанию' });
    });
};
