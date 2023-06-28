const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649c44d50a1776de0b35e538',
  };

  next();
});

app.use(routes);

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Запуск');
  })
  .catch(() => {
    console.log('Запуска не будет');
  });

app.get('/', (req, res) => {
  res.send('Вывод инф-ции на страницу...');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
