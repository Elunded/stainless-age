// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getActiveOrders,
  updateOrder
} = require('../controllers/orderController');

const { ensureAdminAuthenticated } = require('../middlewares/auth');

// Створити замовлення
// POST /orders
router.post('/', createOrder);

// Отримати всі замовлення
// GET /orders
router.get('/', getAllOrders);

// Отримати активні замовлення
// GET /orders/active
router.get('/active', ensureAdminAuthenticated, getActiveOrders);

// Отримати одне замовлення
// GET /orders/:id
router.get('/:id', getOrderById);



// Оновити замовлення
// PUT /orders/:id
router.put('/:id', ensureAdminAuthenticated, updateOrder);

module.exports = router;
