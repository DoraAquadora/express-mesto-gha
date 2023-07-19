// Массив разешённых доменов
const allowedCors = [
  'https://DoraAquadora.student.nomoredomains.xyz',
  'http://DoraAquadora.student.nomoredomains.xyz',
  'https://api.DoraAquadora.students.nomoredomains.xyz',
  'http://api.DoraAquadora.students.nomoredomains.xyz',
  'localhost:3000',
  'http://localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers; // Записываем в переменную origin соответствующий заголовок
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers']; // сохраняем список заголовков исходного запроса

  if (allowedCors.includes(origin)) { // Проверяем: значение origin есть среди разрешённых доменов
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') { // Если это предварительный запрос, добавляем нужные заголовки
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Headers', requestHeaders); // разрешаем кросс-доменные запросы с этими заголовками
    return res.end(); // завершаем обработку запроса и возвращаем результат клиенту
  }

  return next();
};
