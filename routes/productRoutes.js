// routes/productRoutes.js

const express = require('express');
const router = express.Router();

// Імпортуємо функції з контролера товарів
const {
  getAllProducts,
  getProductById,
  getCatalog,
  getCategories
} = require('../controllers/productController');

// Отримати всі товари
// GET /products
router.get('/', getAllProducts);

// Отримати конкретний товар за ID
// GET /products/:id
router.get('/:id', getProductById);

// Каталог із фільтрами, пошуком, пагінацією
// GET /products/catalog
router.get('/catalog', getCatalog); 

// Категорії
// GET /products/categories
router.get('/categories', getCategories);

module.exports = router;
