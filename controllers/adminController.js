// controllers/adminController.js

const path = require('path');

/**
 * Показати сторінку входу (якщо не авторизований)
 */
function showLoginPage(req, res) {
  if (req.session.isAdminAuthenticated) {
    return res.redirect('/admin/dashboard');
  }
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'admin-login.html'));
}

/**
 * Обробити логін
 */
function handleLogin(req, res) {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASS) {
    req.session.isAdminAuthenticated = true;
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/admin');
}

/**
 * Сторінка панелі керування
 */
function showDashboard(req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'admin.html'));
}

/**
 * Сторінка редагування товарів
 */
function showEditProductPage(req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'admin-edit-product.html'));
}

/**
 * Сторінка усіх замовлень
 */
function showOrdersPage(req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'admin-orders.html'));
}

/**
 * Сторінка одного замовлення
 */
function showOrderDetailPage(req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'admin-order.html'));
}

/**
 * Сторінка перегляду відгуків
 */
function showReviewsPage(req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'admin-reviews.html'));
}

/**
 * Вихід
 */
function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/admin');
  });
}

module.exports = {
  showLoginPage,
  handleLogin,
  showDashboard,
  showEditProductPage,
  showOrdersPage,
  showOrderDetailPage,
  showReviewsPage,
  logout
};
