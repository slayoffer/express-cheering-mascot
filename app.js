// Подлкючаем babel для поддержки jsx
require('@babel/register');

const renderTemplate = require('./lib/renderTemplate');
const Mascot = require('./lib/models/mascot');

// Фреймворк веб-приложений.
const express = require('express');
const morgan = require('morgan');
const path = require('path');

// Подключаем React и наши views
const Main = require('./views/Main');
const { reset } = require('nodemon');

const app = express();

const PORT = 3000;

// Подключаем логгирование деталей запросов.
app.use(morgan('dev'));

// Две следующих настройки нужны для того, чтобы мы могли вытащить тело POST-запроса
// Это нужно не всегда (всё зависит от того, как клиент отправляет запросы),
// но пока будем использовать всегда — на всякий случай

// Распознавание входящего объекта в POST-запросе в виде строк или массивов
app.use(express.urlencoded({ extended: true }));
// Распознавание входящего объекта в POST-запросе как объекта JSON
app.use(express.json());

// Подключаем папку public со статическими файлами (картинки, стили и т.д.)
app.use(express.static(path.join(__dirname, 'public')));

// Отображаем главную страницу с использованием компонента "Main"
app.get('/', (req, res) => {
  renderTemplate(Main, req.query, res)
});

app.post('/cheers', async (req, res) => {
  try {
    const { cheer_name } = req.body;
    const signText = Mascot(cheer_name);
    renderTemplate(Main, { signText }, res);
  } catch (error) {
    console.log(error);
  }
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
