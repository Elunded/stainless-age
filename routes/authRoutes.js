// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { showLoginPage, handleLogin } = require('../controllers/adminController');

// Сторінка логіну
router.get('/reg', showLoginPage);

// Обробка логіну
router.post('/reg', handleLogin);

module.exports = router;
