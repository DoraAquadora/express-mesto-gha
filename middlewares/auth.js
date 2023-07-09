const jwt = require('jsonwebtoken');

const { AUTH_KEY } = require('../utils/constants');
const UnauthorizedError = require('../codes/errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMsg = 'Неправильные почта или пароль';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError(`${errorMsg}(${authorization})!`));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, AUTH_KEY);
  } catch (err) {
    return next(new UnauthorizedError(`${errorMsg}!`));
  }

  req.user = payload;

  return next();
};
