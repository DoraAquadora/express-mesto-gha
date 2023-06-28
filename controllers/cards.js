const HttpStatus = require('../helpers/status');
const Card = require('../models/card');

// Находим все карточки:
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(HttpStatus.Success).send(cards))
    .catch(() => res
      .status(HttpStatus.InternalError)
      .send({ message: 'Произошла ошибка при запросе всех карточек' }));
};

// Создаем карточку:
module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HttpStatus.Success).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HttpStatus.BadRequest).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res.status(HttpStatus.InternalError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Удаляем карточку:
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(HttpStatus.NotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(HttpStatus.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HttpStatus.BadRequest).send({
          message: 'Переданы некорректные данные карточки.',
        });
      } else {
        res.status(HttpStatus.InternalError).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// Ставим лайк на карточку:
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(HttpStatus.NotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(HttpStatus.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(HttpStatus.BadRequest)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      }
      return res.status(HttpStatus.InternalError).send({ message: 'Ошибка по умолчанию' });
    });
};

// Убираем лайк с карточки:
module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(HttpStatus.NotFound)
          .send({ message: 'Карточка c указанным id не найдена' });
      }
      return res.status(HttpStatus.Success).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(HttpStatus.BadRequest)
          .send({
            message: 'Переданы некорректные данные для удаления лайка.',
          });
      }
      return res.status(HttpStatus.InternalError).send({ message: 'Ошибка по умолчанию' });
    });
};
