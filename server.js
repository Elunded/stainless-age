require('dotenv').config();


const express = require('express');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // важливо!
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); // Підключаємо `db.js`
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

const session = require('express-session');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.ADMIN_PASS, // замініть на свій секретний ключ
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // для HTTPS встановіть true
}));


/**
 * GET /reg
 * Повертає сторінку входу в адмінпанель.
 */
app.get('/reg', (req, res) => {
  // Припускаємо, що admin-login.html знаходиться у public/
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

/**
 * POST /reg
 * Обробляє відправку форми входу в адмінпанель.
 * Якщо пароль збігається зі змінною ADMIN_PASS, перенаправляє на /admin,
 * інакше – повертає користувача на сторінку /reg.
 */
app.post('/reg', (req, res) => {
  const { password } = req.body;
  console.log("Отриманий пароль:", password);

  if (password === process.env.ADMIN_PASS) {
    // Встановлюємо прапорець автентифікації
    req.session.isAdminAuthenticated = true;
    res.redirect('/admin');
  } else {
    res.redirect('/reg');
  }
});
function ensureAdminAuthenticated(req, res, next) {
  if (req.session && req.session.isAdminAuthenticated) {
    return next();
  }
  res.redirect('/reg');
}

app.get('/admin', ensureAdminAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});







app.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM products");
        res.json(rows);
    } catch (error) {
        res.status(500).send("Помилка сервера");
    }
});

app.get('/reviews/9', async (req, res) => {
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
        console.error("❌ Помилка сервера при отриманні відгуків:", error);
        res.status(500).send("Помилка сервера");
    }
});
app.get('/reviews', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT r.id, r.product_id, p.name AS product_name, r.user_name, r.rating, r.review_text, r.is_anonymous, r.created_at
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            ORDER BY r.created_at DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("❌ Помилка сервера при отриманні відгуків:", error);
        res.status(500).send("Помилка сервера");
    }
});

app.get('/reviews/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        // Запит повертає лише відгуки, де product_id співпадає з productId
        const [rows] = await pool.query(
            `SELECT * FROM reviews WHERE product_id = ?`,
            [productId]
        );
        res.json(rows);
    } catch (error) {
        console.error("Помилка завантаження відгуків для товару:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
});



const fs = require('fs');

app.get('/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const [rows] = await pool.query(`
            SELECT id, name, image_url, description, price, size, weight, shipping_available
            FROM products 
            WHERE id = ?
        `, [productId]);

        if (rows.length === 0) {
            return res.status(404).send("Товар не знайдено");
        }

        const product = rows[0];

        // Якщо до запиту додається параметр ?format=json, повертаємо JSON
        if (req.query.format === 'json') {
            return res.json(product);
        }

        // 🚀 Читаємо 'product.html' з папки public
        const templatePath = path.join(__dirname, "public", "product.html");
        let template = fs.readFileSync(templatePath, "utf-8");

        // Замінюємо плейсхолдери даними продукту
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
        console.error("❌ Помилка сервера:", error);
        res.status(500).send("Помилка сервера");
    }
});

app.listen(3000, () => {
    console.log("🚀 Сервер запущено на http://localhost:3000");
});

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'catalog.html'));
});

app.get('/api/catalog', async (req, res) => {
  try {
    

    const limit  = parseInt(req.query.limit, 10) || 20;
    const page   = parseInt(req.query.page, 10)  || 1;
    const offset = (page - 1) * limit;

    const filter = req.query.filter || 'all';
    const search = req.query.search?.trim() || '';

    let sql      = `SELECT id, name, description, image_url, price FROM products`;
    let countSQL = `SELECT COUNT(*) AS total              FROM products`;

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
    console.error("Помилка в endpoint /api/catalog:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});





app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT category FROM stainless_age.products");
    // rows – масив об’єктів, наприклад: [ { category: 'Індивідуальне замовлення' }, { category: 'Для ванни' }, ... ]
    res.json(rows);
  } catch (error) {
    console.error("Помилка отримання категорій:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});



app.post('/api/orders', async (req, res) => {
  const { firstName, lastName, phone, cart } = req.body;
  if (!firstName || !phone || !cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Некоректні дані" });
  }

  try {
    // Перевіряємо, чи існує клієнт
    const [customerRows] = await pool.query('SELECT id FROM clients WHERE phone = ?', [phone]);
    let customerId;
    if (customerRows.length > 0) {
      customerId = customerRows[0].id;
      console.log("Знайдений існуючий клієнт, id:", customerId);
    } else {
      // Створюємо нового клієнта
      const [newCustomerResult] = await pool.query(
        'INSERT INTO clients (first_name, last_name, phone, successful_orders) VALUES (?, ?, ?, 0)',
        [firstName, lastName, phone]
      );
      customerId = newCustomerResult.insertId;
    }

    // Отримуємо реальні ціни товарів із БД
    const productIds = cart.map(item => item.id);
    const [products] = await pool.query('SELECT id, price FROM products WHERE id IN (?)', [productIds]);

    // Розрахунок суми та формування JSON-списку товарів
    let total = 0;
    const orderItems = cart.map(item => {
      const dbProduct = products.find(p => p.id == item.id);
      if (!dbProduct) throw new Error(`Товар ID ${item.id} не знайдено`);
      const finalPrice = dbProduct.price * item.quantity;
      total += finalPrice;
      return { id: item.id, name: item.name, quantity: item.quantity, price: dbProduct.price };
    });

    // Створюємо замовлення
    const [result] = await pool.query(
      'INSERT INTO orders (client_id, items, order_status, total_price, created_at) VALUES (?, ?, ?, ?, NOW())',
      [customerId, JSON.stringify(orderItems), "Прийняте", total]
    );

    res.json({ orderId: result.insertId });
  } catch (error) {
    console.error("Помилка при створенні замовлення:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id, 
        o.order_status, 
        o.created_at, 
        o.total_price, 
        o.client_id, 
        CONCAT_WS(' ', c.first_name, c.last_name) AS clientName
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Помилка при отриманні списку всіх замовлень:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Endpoint для повернення всіх замовлень, відсортованих за статусом та датою
app.get('/api/order', async (req, res) => {
  try {
    const orderId = req.query.id;
    if (!orderId) {
      return res.status(400).json({ error: "ID замовлення не передано" });
    }
    const [rows] = await pool.query(`
      SELECT 
        o.id,
        o.order_status,
        o.created_at,
        o.total_price,
        o.items,
        o.client_id,
        CONCAT_WS(' ', c.first_name, c.last_name) AS clientName,
        c.phone,
        c.successful_orders
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.id = ?
    `, [orderId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Замовлення не знайдено" });
    }
    const order = rows[0];
    res.json(order);
  } catch (error) {
    console.error("Помилка при отриманні даних замовлення:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Endpoint для повернення лише активних замовлень
app.get('/api/orders/active', ensureAdminAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id, 
        o.order_status, 
        o.created_at, 
        o.client_id, 
        CONCAT_WS(' ', c.first_name, c.last_name) AS clientName
      FROM orders o
      LEFT JOIN clients c ON o.client_id = c.id
      WHERE o.order_status IN (?, ?)
      ORDER BY o.created_at DESC
    `, ['Прийняте', 'Виготовляється']);
    res.json(rows);
  } catch (error) {
    console.error("Помилка при отриманні активних замовлень:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.get('/api/client/:id', async (req, res) => {
  try {
    const clientId = req.params.id;
    const [rows] = await pool.query(
      'SELECT CONCAT_WS(" ", first_name, last_name) AS clientName FROM clients WHERE id = ?',
      [clientId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Клієнта не знайдено" });
    }
    res.json(rows[0]); // Наприклад, { clientName: "Ім'я Прізвище" }
  } catch (error) {
    console.error("Помилка при отриманні клієнта:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Захищені маршрути
app.get('/admin/edit-product', ensureAdminAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-edit-product.html'));
});
app.get('/admin/orders', ensureAdminAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-orders.html'));
});
app.get('/admin/reviews', ensureAdminAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-reviews.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});
app.get('/order-confirmation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order-confirmation.html'));
});



app.put('/api/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, image_url, price, size, weight, shipping_available } = req.body;

    // Виконуємо оновлення даних у базі даних
    const [result] = await pool.query(
      `UPDATE products 
       SET name = ?, description = ?, image_url = ?, price = ?, size = ?, weight = ?, shipping_available = ? 
       WHERE id = ?`,
      [name, description, image_url, price, size, weight, shipping_available ? 1 : 0, productId]
    );

    // Якщо оновлено хоча б один рядок – повертаємо статус 200, інакше — 404
    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: "Товар не знайдено" });
    }
  } catch (error) {
    console.error("Помилка оновлення товару:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.get('/admin/order', ensureAdminAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-order.html'));
});


app.put('/api/order/:id', ensureAdminAuthenticated, async (req, res) => {
  try {
    const orderId = req.params.id;
    // Отримуємо оновлені дані з тіла запиту. Ми більше не очікуємо поле successful_orders від клієнта.
    const { order_status, items, client_name, client_phone } = req.body;

    if (!order_status || !Array.isArray(items)) {
      return res.status(400).json({ error: "Некоректні дані" });
    }

    // Обчислюємо сумарну вартість замовлення
    let total_price = 0;
    items.forEach(item => {
      total_price += Number(item.quantity) * Number(item.price);
    });

    // Спочатку отримуємо поточний статус замовлення та client_id
    const [orderRows] = await pool.query(
      `SELECT order_status, client_id FROM orders WHERE id = ?`,
      [orderId]
    );
    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Замовлення не знайдено" });
    }
    const currentStatus = orderRows[0].order_status;
    const clientId = orderRows[0].client_id;

    // Оновлюємо замовлення з новими даними
    const [resultOrder] = await pool.query(
      `UPDATE orders SET order_status = ?, items = ?, total_price = ? WHERE id = ?`,
      [order_status, JSON.stringify(items), total_price, orderId]
    );

    // Якщо статус замовлення змінюється на "Виконано" і раніше він не був "Виконано"
    if (order_status === "Виконано" && currentStatus !== "Виконано" && clientId) {
      await pool.query(
        `UPDATE clients SET successful_orders = successful_orders + 1 WHERE id = ?`,
        [clientId]
      );
    }

    // Розбиваємо client_name на first_name та last_name.
    if (clientId) {
      const nameParts = client_name.trim().split(" ");
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ") || "";
      
      await pool.query(
        `UPDATE clients SET first_name = ?, last_name = ?, phone = ? WHERE id = ?`,
        [firstName, lastName, client_phone, clientId]
      );
    }

    if (resultOrder.affectedRows > 0) {
      return res.sendStatus(200);
    } else {
      return res.status(404).json({ error: "Замовлення не знайдено" });
    }
  } catch (error) {
    console.error("Помилка оновлення замовлення:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});


app.delete('/api/review/:id', ensureAdminAuthenticated, async (req, res) => {
  try {
    const reviewId = req.params.id;

    const [result] = await pool.query(
      `DELETE FROM reviews WHERE id = ?`,
      [reviewId]
    );

    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: "Відгук не знайдено" });
    }
  } catch (error) {
    console.error("Помилка видалення відгуку:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});
