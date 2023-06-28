const User = require('../models/user');

const DEFAULT_ERROR_CODE = 500;
const NOT_FOUND_ERROR_CODE = 404;
const INVALID_PARAMS_ERROR_CODE = 400;

const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const getUserId = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => res.send(user)) // .status(200)
    .orFail()
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INVALID_PARAMS_ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные при поиске пользователя',
          });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({
            message: 'Пользователь c указанным _id не найден',
          });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user)) // .status(201)
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INVALID_PARAMS_ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user)) // .status(200)
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(INVALID_PARAMS_ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({
            message: 'Пользователь не найден',
          });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user)) // .status(200)
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(INVALID_PARAMS_ERROR_CODE)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({
            message: 'Пользователь не найден',
          });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};
module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUserProfile,
  updateUserAvatar,
};
