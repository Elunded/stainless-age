// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const {
  showLoginPage,
  handleLogin,
  showDashboard,
  showEditProductPage,
  showOrdersPage,
  showOrderDetailPage,
  showReviewsPage,
  logout
} = require('../controllers/adminController');

const { ensureAdminAuthenticated } = require('../middlewares/auth');

// Сторінка входу
// GET /admin/reg
router.get('/', showLoginPage);

// Обробка логіна
// POST /admin/reg
router.post('/', handleLogin);

// Панель адміністратора
// GET /admin/dashboard
router.get('/dashboard', ensureAdminAuthenticated, showDashboard);

// Сторінка редагування товарів
// GET /admin/edit-product
router.get('/edit-product', ensureAdminAuthenticated, showEditProductPage);

// Сторінка всіх замовлень
// GET /admin/orders
router.get('/orders', ensureAdminAuthenticated, showOrdersPage);

// Сторінка одного замовлення
// GET /admin/order
router.get('/order', ensureAdminAuthenticated, showOrderDetailPage);

// Сторінка відгуків
// GET /admin/reviews
router.get('/reviews', ensureAdminAuthenticated, showReviewsPage);

// Вихід
// GET /admin/logout
router.get('/logout', logout);

module.exports = router;
