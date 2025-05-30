// controllers/orderController.js

const pool = require('../config/db');

/**
 * Створити нове замовлення
 */
async function createOrder(req, res) {
  const { firstName, lastName, phone, cart } = req.body;

  if (!firstName || !phone || !cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Некоректні дані' });
  }

  try {
    // Перевірка, чи існує клієнт
    const [customerRows] = await pool.query('SELECT id FROM clients WHERE phone = ?', [phone]);
    let customerId;

    if (customerRows.length > 0) {
      customerId = customerRows[0].id;
    } else {
      // Створення нового клієнта
      const [result] = await pool.query(
        'INSERT INTO clients (first_name, last_name, phone, successful_orders) VALUES (?, ?, ?, 0)',
        [firstName, lastName, phone]
      );
      customerId = result.insertId;
    }

    // Отримання цін
    const productIds = cart.map(item => item.id);
    const [products] = await pool.query('SELECT id, price FROM products WHERE id IN (?)', [productIds]);

    let total = 0;
    const orderItems = cart.map(item => {
      const dbProduct = products.find(p => p.id == item.id);
      if (!dbProduct) throw new Error(`Товар ID ${item.id} не знайдено`);
      const price = dbProduct.price;
      total += price * item.quantity;
      return { id: item.id, name: item.name, quantity: item.quantity, price };
    });

    const [orderResult] = await pool.query(
      'INSERT INTO orders (client_id, items, order_status, total_price, created_at) VALUES (?, ?, ?, ?, NOW())',
      [customerId, JSON.stringify(orderItems), 'Прийняте', total]
    );

    res.json({ orderId: orderResult.insertId });
  } catch (error) {
    console.error('❌ Помилка при створенні замовлення:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

/**
 * Отримати всі замовлення
 */
async function getAllOrders(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id, o.order_status, o.created_at, o.total_price, o.client_id,
        CONCAT_WS(' ', c.first_name, c.last_name) AS clientName
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Помилка при отриманні замовлень:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

/**
 * Отримати замовлення за ID
 */
async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    const [rows] = await pool.query(`
      SELECT 
        o.id, o.order_status, o.created_at, o.total_price, o.items,
        o.client_id, CONCAT_WS(' ', c.first_name, c.last_name) AS clientName,
        c.phone, c.successful_orders
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.id = ?
    `, [orderId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Помилка при отриманні замовлення:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

/**
 * Отримати активні замовлення
 */
async function getActiveOrders(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id, o.order_status, o.created_at, o.client_id,
        CONCAT_WS(' ', c.first_name, c.last_name) AS clientName
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.order_status IN (?, ?)
      ORDER BY o.created_at DESC
    `, ['Прийняте', 'Виготовляється']);
    res.json(rows);
  } catch (error) {
    console.error('❌ Помилка при отриманні активних замовлень:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

/**
 * Оновити замовлення
 */
async function updateOrder(req, res) {
  try {
    const orderId = req.params.id;
    const { order_status, items, client_name, client_phone } = req.body;

    if (!order_status || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Некоректні дані' });
    }

    let total_price = 0;
    items.forEach(item => {
      total_price += Number(item.quantity) * Number(item.price);
    });

    const [orderRows] = await pool.query(
      `SELECT order_status, client_id FROM orders WHERE id = ?`,
      [orderId]
    );
    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    const { order_status: currentStatus, client_id } = orderRows[0];

    await pool.query(
      `UPDATE orders SET order_status = ?, items = ?, total_price = ? WHERE id = ?`,
      [order_status, JSON.stringify(items), total_price, orderId]
    );

    // Якщо статус став "Виконано", оновлюємо лічильник
    if (order_status === 'Виконано' && currentStatus !== 'Виконано') {
      await pool.query(
        `UPDATE clients SET successful_orders = successful_orders + 1 WHERE id = ?`,
        [client_id]
      );
    }

    // Оновлення клієнта
    if (client_name && client_phone) {
      const nameParts = client_name.trim().split(' ');
      const firstName = nameParts.shift() || '';
      const lastName = nameParts.join(' ') || '';
      await pool.query(
        `UPDATE clients SET first_name = ?, last_name = ?, phone = ? WHERE id = ?`,
        [firstName, lastName, client_phone, client_id]
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Помилка при оновленні замовлення:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getActiveOrders,
  updateOrder
};
