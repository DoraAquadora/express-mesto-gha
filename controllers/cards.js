const Card = require('../models/card');

const DEFAULT_ERROR_CODE = 500;
const NOT_FOUND_ERROR_CODE = 404;
const INVALID_PARAMS_ERROR_CODE = 400;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res
      .status(DEFAULT_ERROR_CODE)
      .send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  // console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INVALID_PARAMS_ERROR_CODE).send({
          message: 'Невалидные данные',
        });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INVALID_PARAMS_ERROR_CODE).send({
          message: 'Переданы некорректные данные карточки.',
        });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
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
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INVALID_PARAMS_ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
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
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INVALID_PARAMS_ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные для удаления лайка.',
          });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};
module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
