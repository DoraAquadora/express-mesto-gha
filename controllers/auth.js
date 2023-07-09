const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { AUTH_KEY } = require('../utils/constants');
const UnauthorizedError = require('../codes/errors/UnauthorizedError');
const ConflictError = require('../codes/errors/ConflictError');
const BadRequestError = require('../codes/errors/BadRequestError');

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError(
            'Данный пользователь существует',
          ),
        );
      } else if (err.name === 'ValidationError') {
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

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, AUTH_KEY, {
          expiresIn: '7d',
        });

        return res.send({ _id: token });
      }

      throw new UnauthorizedError('Неверные почта или пароль');
    })
    .catch(next);
};
