// routes/staticRoutes.js

const express = require('express');
const path = require('path');
const router = express.Router();

/**
 * Каталог товарів
 * GET /catalog
 */
router.get('/catalog', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'catalog.html'));
});

/**
 * Сторінка кошика
 * GET /cart
 */
router.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'cart.html'));
});

/**
 * Оформлення замовлення
 * GET /checkout
 */
router.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'checkout.html'));
});

/**
 * Сторінка "Про нас"
 * GET /about
 */
router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'about.html'));
});

/**
 * Сторінка підтвердження замовлення
 * GET /order-confirmation
 */
router.get('/order-confirmation', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'order-confirmation.html'));
});

module.exports = router;
