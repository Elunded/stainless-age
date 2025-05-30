// controllers/reviewController.js

const pool = require('../config/db');

/**
 * Отримати останні 9 відгуків
 */
async function getLatestReviews(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT r.product_id, p.name AS product_name, r.user_name, r.rating, r.review_text, r.is_anonymous, r.created_at
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
      LIMIT 9
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Помилка при отриманні останніх відгуків:', error);
    res.status(500).send('Помилка сервера');
  }
}

/**
 * Отримати всі відгуки
 */
async function getAllReviews(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, r.product_id, p.name AS product_name, r.user_name, r.rating, r.review_text, r.is_anonymous, r.created_at
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Помилка при отриманні всіх відгуків:', error);
    res.status(500).send('Помилка сервера');
  }
}

/**
 * Отримати відгуки для конкретного товару
 */
async function getReviewsByProductId(req, res) {
  try {
    const productId = req.params.id;
    const [rows] = await pool.query(
      `SELECT * FROM reviews WHERE product_id = ?`,
      [productId]
    );
    res.json(rows);
  } catch (error) {
    console.error('❌ Помилка при отриманні відгуків для товару:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

/**
 * Видалити відгук (тільки адмін)
 */
async function deleteReview(req, res) {
  try {
    const reviewId = req.params.id;
    const [result] = await pool.query(
      `DELETE FROM reviews WHERE id = ?`,
      [reviewId]
    );

    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'Відгук не знайдено' });
    }
  } catch (error) {
    console.error('❌ Помилка при видаленні відгуку:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

module.exports = {
  getLatestReviews,
  getAllReviews,
  getReviewsByProductId,
  deleteReview
};
