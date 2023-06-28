const HttpStatus = require('../helpers/status');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(HttpStatus.Success).send(cards))
    .catch(() => res
      .status(HttpStatus.InternalError)
      .send({ message: 'Ошибка запрпоса' }));
};

const createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HttpStatus.Success).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HttpStatus.BadRequest).send({
          message: 'Неверные данные',
        });
      } else {
        res.status(HttpStatus.InternalError).send({ message: 'Ошибка ' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(HttpStatus.NotFound)
          .send({ message: 'id не найден' });
      }
      return res.status(HttpStatus.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HttpStatus.BadRequest).send({
          message: 'Неверные данные',
        });
      } else {
        res.status(HttpStatus.InternalError).send({ message: 'Ошибка ' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(HttpStatus.NotFound)
          .send({ message: 'id не найден' });
      }
      return res.status(HttpStatus.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(HttpStatus.BadRequest)
          .send({
            message: 'Неверные данные',
          });
      }
      return res.status(HttpStatus.InternalError).send({ message: 'Ошибка ' });
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(HttpStatus.NotFound)
          .send({ message: 'id не найден' });
      }
      return res.status(HttpStatus.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(HttpStatus.BadRequest)
          .send({
            message: 'Неверные данные',
          });
      }
      return res.status(HttpStatus.InternalError).send({ message: 'Ошибка ' });
    });
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
