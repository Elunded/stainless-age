// middlewares/auth.js

/**
 * Middleware для перевірки автентифікації адміна
 */
function ensureAdminAuthenticated(req, res, next) {
  if (req.session && req.session.isAdminAuthenticated) {
    return next();
  }
  res.redirect('/reg'); // або res.status(403).json({ error: "Unauthorized" });
}

module.exports = {
  ensureAdminAuthenticated
};
