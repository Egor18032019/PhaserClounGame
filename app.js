// Читаем параметры в нашем файле .env 
// и делаем эти значения доступными как переменные среды
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
 /**
 * './routes/main.js'
 */
const routes = require('./routes/main');
/**
 * './routes/secure.js'
 */
const secureRoutes = require('./routes/secure');


// Создаем экземпляр приложения express
const app = express();

// Обновляем настройки express
app.use(bodyParser.urlencoded({
  extended: false
})); // разбираем application/x-www-form-urlencoded
app.use(bodyParser.json()); // разбираем application/json

app.use(cookieParser());

 app.use(express.static(__dirname + '')); //?? убрать?
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/game.html');
});
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/game.html');
});


//сначало он смотрит в первом есть ли это потом во втором и дальше
// Главный маршрут
app.use('/', routes);
// // другие маршруты
app.use('/', secureRoutes);
 

// Отлавливаем все остальные маршруты
app.use("/",
  (req, res, next) => {
    console.log(req.body, "app.js stroke 71")
    res.status(404);
    res.json({
      message: '404 - Not Found(совсем нет)'
    });
  }
);

// Обработка ошибок
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err
  });
});

// Начинаем прослушивать сервер на выбранном порту
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});