/**
 * Middleware genérico para autorizar roles
 * @param {Array} allowedRoles - roles permitidos para la ruta
 * Ejemplo: ['admin', 'vendedor']
 */
function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.session || !req.session.role) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userRole = req.session.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: `Acceso denegado: rol ${userRole} no permitido` });
    }

    next();
  };
}

function isAdmin(req, res, next) {
  return authorizeRoles(['admin'])(req, res, next);
}


function isVendedor(req, res, next) {
  return authorizeRoles(['vendedor'])(req, res, next);
}


function isOtro(req, res, next) {
  return authorizeRoles(['otro'])(req, res, next);
}

module.exports = {
  authorizeRoles,
  isAdmin,
  isVendedor,
  isOtro
};