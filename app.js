const express = require('express');
const mongoose = require('mongoose');

const routcard = require('./routes/cards');
const routUser = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(routcard);
app.use(routUser);
app.use((req, res) => {
  res
    .status(404)
    .send({
      message: 'Страница не найдена',
    });
});

app.use((req, res, next) => {
  req.user = {
    _id: '649b3e5702670e62e27cb219',
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('успешное подключение');
  })
  .catch(() => {
    console.log('не поделючено');
  });

app.get('/', (req, res) => {
  res.send('Вывод инф-ции на страницу...');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
