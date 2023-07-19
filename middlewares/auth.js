require('dotenv').config();
const jwt = require('jsonwebtoken');
const myError = require('../errors/errors');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new myError.AuthError(myError.AuthMsg));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new myError.AuthError(myError.AuthMsg));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
