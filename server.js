require('dotenv').config(); // Завантажує змінні середовища з .env

const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// ==== Middleware ====
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Статичні файли (HTML, CSS, JS, зображення)
app.use(express.static(path.join(__dirname, 'public')));

// Сесії для збереження авторизації адміністратора
app.use(session({
  secret: process.env.ADMIN_PASS, // Або краще окрема змінна, напр. SESSION_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Встановити true в HTTPS
}));

// ==== Підключення маршрутів ====
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const staticRoutes = require('./routes/staticRoutes');



app.use('/api', catalogRoutes)
app.use('/product', productRoutes);
app.use('/reviews', reviewRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/', authRoutes); // Тепер /reg доступне напряму


app.use('/', staticRoutes); // маршрути на /catalog, /cart, /checkout тощо




// ==== Обробка помилок ====

/**
 * Обробка 404: сторінка не знайдена
 */
app.use((req, res) => {
  res.status(404).send('Сторінку не знайдено');
});

/**
 * Обробка 500: внутрішня помилка сервера
 */
app.use((err, req, res, next) => {
  console.error('❌ Невідома помилка сервера:', err);
  res.status(500).send('Внутрішня помилка сервера');
});

// ==== Запуск сервера ====
app.listen(port, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${port}`);
});
