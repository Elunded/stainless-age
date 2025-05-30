// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const {
  getLatestReviews,
  getAllReviews,
  getReviewsByProductId,
  deleteReview
} = require('../controllers/reviewController');

const { ensureAdminAuthenticated } = require('../middlewares/auth');

// Отримати останні 9 відгуків
// GET /reviews/9
router.get('/9', getLatestReviews);

// Отримати всі відгуки
// GET /reviews
router.get('/', getAllReviews);

// Отримати відгуки для конкретного товару
// GET /reviews/product/:id
router.get('/product/:id', getReviewsByProductId);

// Видалити відгук (тільки адмін)
// DELETE /reviews/:id
router.delete('/:id', ensureAdminAuthenticated, deleteReview);

module.exports = router;
