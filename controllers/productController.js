// controllers/productController.js

const path = require('path');
const fs = require('fs');
const pool = require('../config/db');

/**
 * Отримати всі товари
 */
async function getAllProducts(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('❌ Помилка при отриманні товарів:', error);
    res.status(500).send('Помилка сервера');
  }
}

/**
 * Отримати конкретний товар за ID
 * Підтримує формат JSON або HTML
 */
async function getProductById(req, res) {
  try {
    const productId = req.params.id;

    const [rows] = await pool.query(`
      SELECT id, name, image_url, description, price, size, weight, shipping_available
      FROM products 
      WHERE id = ?
    `, [productId]);

    if (rows.length === 0) {
      return res.status(404).send('Товар не знайдено');
    }

    const product = rows[0];

    // Якщо запитано JSON
    if (req.query.format === 'json') {
      return res.json(product);
    }

    // Рендеримо шаблон HTML
    const templatePath = path.join(__dirname, '..', 'public', 'product.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    // Замінюємо плейсхолдери
    template = template
      .replace(/{{name}}/g, product.name)
      .replace(/{{image_url}}/g, product.image_url)
      .replace(/{{description}}/g, product.description)
      .replace(/{{price}}/g, Number(product.price).toFixed(2))
      .replace(/{{size}}/g, product.size)
      .replace(/{{weight}}/g, product.weight)
      .replace(/{{shipping_available}}/g, product.shipping_available ? 'Доступно до відправки' : 'Відправка недоступна');

    res.send(template);
  } catch (error) {
    console.error('❌ Помилка при отриманні товару:', error);
    res.status(500).send('Помилка сервера');
  }
}

/**
 * Каталог товарів з пагінацією, пошуком і фільтром
 */
async function getCatalog(req, res) {
  try {
    const limit  = parseInt(req.query.limit, 10) || 20;
    const page   = parseInt(req.query.page, 10)  || 1;
    const offset = (page - 1) * limit;

    const filter = req.query.filter || 'all';
    const search = req.query.search?.trim() || '';

    let sql      = `SELECT id, name, description, image_url, price FROM products`;
    let countSQL = `SELECT COUNT(*) AS total FROM products`;

    const conditions  = [];
    const sqlParams   = [];
    const countParams = [];

    if (search) {
      conditions.push(`name LIKE ?`);
      const pattern = `%${search.replace(/%/g, '\\%')}%`;
      sqlParams.push(pattern);
      countParams.push(pattern);
    }

    if (filter !== 'all') {
      conditions.push(`category = ?`);
      sqlParams.push(filter);
      countParams.push(filter);
    }

    if (conditions.length) {
      const where = ' WHERE ' + conditions.join(' AND ');
      sql      += where;
      countSQL += where;
    }

    sql += ` LIMIT ? OFFSET ?`;
    sqlParams.push(limit, offset);

    const [products]    = await pool.query(sql, sqlParams);
    const [countResult] = await pool.query(countSQL, countParams);
    const total         = countResult[0].total;

    res.json({ products, total });
  } catch (error) {
    console.error("❌ Помилка в getCatalog:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
}

/**
 * Отримати всі унікальні категорії товарів
 */
async function getCategories(req, res) {
  try {
    const [rows] = await pool.query("SELECT DISTINCT category FROM products");
    res.json(rows);
  } catch (error) {
    console.error("❌ Помилка отримання категорій:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getCatalog,
  getCategories
};
