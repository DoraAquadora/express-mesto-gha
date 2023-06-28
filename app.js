const express = require('express');
const mongoose = require('mongoose');

const routuser = require('./routes/users');
const routCard = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649c44d50a1776de0b35e538',
  };

  next();
});

app.use(routuser);
app.use(routCard);
app.use('/*', (req, res) => {
  res.status(404)
    .send({ message: '404: Страница не найдена.' });
});

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('БД подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД');
  });

app.get('/', (req, res) => {
  res.send('Вывод инф-ции на страницу...');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
