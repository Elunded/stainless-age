const express = require('express');
const router = express.Router();
const { getCatalog, getCategories } = require('../controllers/productController');

router.get('/catalog', getCatalog);
router.get('/categories', getCategories);

module.exports = router;
