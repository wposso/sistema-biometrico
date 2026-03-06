const Auth = require('../models/auth.model');

const ensureAuth = async (req, res, next) => {
  try {
    const sessionId = req.sessionID;

    if (!sessionId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const session = await Auth.validateSession(sessionId);
    if (!session) return res.status(401).json({ error: 'Sesión inválida o expirada' });

    // Actualizar expiración +1 hora
    //await Auth.updateSession(sessionId);

    req.session.userId = session.user_id;
    req.deviceId = session.device_id;

    next();
  } catch (err) {
    console.error('Error en ensureAuth:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { ensureAuth };
