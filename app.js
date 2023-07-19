/* сервер если запустился, то слушает порты (ручки). На бэке приложение запускает нода */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const router = require('express').Router();
const { celebrate, errors } = require('celebrate');

const {
  validateLogin,
  validateUser,
} = require('./utils/validators');
const auth = require('./middlewares/auth');
const defaultError = require('./middlewares/defaultError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const { login, createUser } = require('./controllers/auth');
const myError = require('./errors/errors');

const {
  PORT = 3000,
  BASE_PATH,
} = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1/mestodb');

/* метод use позволяет использовать middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors);

app.use(requestLogger); // подключаем логгер запросов до роутов

app.post('/signin', celebrate(validateLogin), login);
app.post('/signup', celebrate(validateUser), createUser);

// авторизация
app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));

app.use(router);
app.use('*', (req, res, next) => {
  next(new myError.NotFoundError(myError.NotFoundMsg));
}); // несуществующий роут всегда должен быть после остальных роутов в конце

app.use(errorLogger); // подключаем логгер ошибок после роутов, до ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(defaultError); // централизованный обработчик ошибок

/* прослушивание порта из первого параметра и колбэк, который выполнится при запуске приложения */
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Ссылка на сервер ${BASE_PATH}`);
});
