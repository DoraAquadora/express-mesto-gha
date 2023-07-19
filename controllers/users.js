/* экспортируем модель со схемой в контроллер */
const User = require('../models/user');
const myError = require('../errors/errors');

const checkUser = (user, res) => {
  if (!user) {
    throw new myError.NotFoundError(myError.NotFoundMsg);
  }
  return res.send(user);
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new myError.NotFoundError(myError.NotFoundMsg);
      }
      return res.send(user);
    })
    .catch(next);
};

const getYourself = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new myError.NotFoundError(myError.NotFoundMsg);
    })
    .then((user) => res.send(user))
    .catch(next);
};

const editUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => checkUser(user, res))
    .catch(next);
};

const changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => checkUser(user, res))
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserById,
  getYourself,
  changeAvatar,
  editUser,
};
