const User = require('../models/user');
const statusErr = require('../codes/status');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(statusErr.Success).send(users))
    .catch(() => res.status(statusErr.InternalError).send({ message: 'ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(statusErr.NotFound)
          .send({ message: 'id не определен' });
      }
      return res.status(statusErr.Success).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(statusErr.BadRequest)
          .send({
            message: 'неверные данные ',
          });
      } else {
        res.status(statusErr.InternalError).send({ message: 'ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(statusErr.Success).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusErr.BadRequest).send({
          message: 'неверные данные ',
        });
      } else {
        res.status(statusErr.InternalError).send({ message: 'ошибка' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
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
          .status(statusErr.BadRequest)
          .send({
            message: 'неверные данные ',
          });
      }
      return res.status(statusErr.InternalError).send({ message: 'ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(statusErr.Success).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(statusErr.BadRequest)
          .send({
            message: 'неверные данные ',
          });
      }
      return res.status(statusErr.InternalError).send({ message: 'ошибка' });
    });
};
