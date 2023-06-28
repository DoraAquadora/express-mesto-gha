const HttpStatus = require('../helpers/status');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HttpStatus.Success).send(users))
    .catch(() => res.status(HttpStatus.InternalError).send({ message: 'Ошибка' }));
};

const getUserId = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(HttpStatus.NotFound)
          .send({ message: 'id не найден' });
      }
      return res.status(HttpStatus.Success).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(HttpStatus.BadRequest)
          .send({
            message: 'Неверные данные ',
          });
      } else {
        res.status(HttpStatus.InternalError).send({ message: 'Ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HttpStatus.Success).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HttpStatus.BadRequest).send({
          message: 'Неверные данные ',
        });
      } else {
        res.status(HttpStatus.InternalError).send({ message: 'Ошибка' });
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(HttpStatus.BadRequest)
          .send({
            message: 'Неверные данные ',
          });
      }
      return res.status(HttpStatus.InternalError).send({ message: 'Ошибка' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(HttpStatus.Success).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(HttpStatus.BadRequest)
          .send({
            message: 'Неверные данные ',
          });
      }
      return res.status(HttpStatus.InternalError).send({ message: 'Ошибка' });
    });
};
module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
