const User = require('../models/user.model');
const Device = require('../models/device.model');
const AuthModel = require('../models/auth.model');
const { createAlert } = require('../service/alert.service');

const AuthController = {

  login: async (req, res) => {
    try {
      const { email, password, device_uuid, platform, model, os_version } = req.body;

      const user = await AuthModel.findUser(email);
      if (!user || !user.is_active)
        return res.status(401).json({ error: 'Credenciales inválidas' });

      const valid = await User.verifyPassword(password);
      if (!valid)
        return res.status(401).json({ error: 'Credenciales inválidas' });

      let device = await Device.findActiveByUser(user.id);

      if (device) {

        if (device.device_uuid !== device_uuid) {

          await createAlert({
            user_id: user.id,
            type: 'Dispositivo no autorizado',
            description: `Intento login con otro device: ${device_uuid}`
          });

          return res.status(403).json({
            error: 'Este usuario ya tiene otro dispositivo activo'
          });
        }

      } else {

        device = await Device.create({
          user_id: user.id,
          device_uuid,
          platform,
          model,
          os_version
        });
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      await AuthModel.insertSession({
        userId: user.id,
        sessionId: req.sessionID,
        deviceId: device.id
      });

      res.json({
        message: 'Login successful',
        sessionID: req.sessionID,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      });

    } catch (err) {
      console.error('Error login:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  logout: async (req, res) => {
    try {

      const sessionId = req.sessionID;

      await AuthModel.deleteSession(sessionId);

      req.session.destroy(err => {
        if (err) console.error('Error destruyendo session:', err);
      });

      res.clearCookie('connect.sid');

      res.json({ message: 'Logout successful' });

    } catch (err) {
      console.error('Error logout:', err);
      res.status(500).json({ error: 'Error interno al cerrar sesión' });
    }
  },

  renew: async (req, res) => {
    try {
      const session = await AuthModel.validateForRenew(req.sessionID, 5);
      if (!session) return res.status(401).json({ error: 'Sesión inválida o demasiado vieja para renovar' });

      // Renueva la expiración del sessionID activo
      await AuthModel.updateSession(req.sessionID);

      res.json({
        message: 'Sesión extendida 1 hora más',
        sessionID: req.sessionID
      });
    } catch (err) {
      console.error('Error renovando sesión:', err);
      res.status(500).json({ error: 'Error al renovar sesión' });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { email, password } = req.body;

      await AuthModel.changePassword(email, password);

      res.json({
        message: "Contraseña actualizada correctamente"
      });

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  },

  getApplicant: async (req, res) => {
    try {
      const { documentNumber, documentTypeId, companyCode } = req.body;

      const applicants = await AuthModel.getApplication(
        documentNumber,
        documentTypeId,
        companyCode
      );

      if (applicants.length === 0) {
        return res.status(404).json({
          message: "No se encontró el aplicante"
        });
      }

      res.json(applicants);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Error consultando aplicante"
      });
    }
  },

  loginBiometric: async (req, res) => {
    try {
      const { type, dni, code } = req.body;

      if (!type || !dni || !code) {
        return res.status(400).json({ message: 'Faltan parámetros obligatorios.' });
      }

      const result = await AuthModel.loginBiometric(type, dni, code);

      if (!result) {
        return res.status(404).json({ message: 'No se encontraron registros.' });
      }

      const response = {
        user: {
          name: result.first_name,
          last_name: result.last_name,
          status: result.emp_status
        },
        company: {
          companyid: result.companyid,
          nit: result.nit,
          name: result.name
        },
        schedule: result.date ? {
          type: result.type,
          date: result.date
        } : null
      };

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }



};

module.exports = AuthController;


/*const db = require('../config/db');
const User = require('../models/user.model');
const Device = require('../models/device.model');
const { createAlert } = require('../service/alert.service');

const Auth = {

  login: async (req, res) => {
    try {
      const { email, password, device_uuid, platform, model, os_version } = req.body;

      const finded = await User.findByEmail(email);
      if (!finded) return res.status(401).json({ error: 'User no found' });

      const user = await db.oneOrNone('SELECT * FROM users WHERE email=$1', [email]);
      if (!user || !user.is_active) return res.status(401).json({ error: 'Password wrong' });

      const valid = await User.verifyPassword(user, password);
      if (!valid) return res.status(401).json({ error: 'Password wrong' });

      let device = await Device.findActiveByUser(user.id);

      if (device) {
        await Device.bindDevice(user.id, device_uuid);
        if (device.device_uuid !== device_uuid) {

          await createAlert({
            user_id: user.id,
            type: 'Dispositivo no autorizado',
            description: `Intento login con otro device: ${device_uuid}`
          });

          return res.status(403).json({ error: 'Este usuario ya tiene otro dispositivo activo' });
        }
      } else {
        device = await Device.create({
          user_id: user.id,
          device_uuid,
          platform,
          model,
          os_version
        });
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      await db.none(
        `INSERT INTO user_session (userid, sessionid, deviceid, expires_at)
      VALUES ($1, $2, $3, NOW() + interval '1 hour')`,
        [user.id, req.sessionID, device.id]
      );

      res.json({
        message: 'Login successful',
        sessionID: req.sessionID,
        user: { id: user.id, name: user.name, role: user.role }
      });

    } catch (err) {
      console.error('Error login:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  logout: async (req, res) => {
    try {
      const sessionId = req.sessionID;
      req.session.destroy(err => {
        if (err) console.error('Error destruyendo session:', err);
      });

      await db.none('DELETE FROM user_sessions WHERE session_id=$1', [sessionId]);

      res.clearCookie('connect.sid');

      res.json({ message: 'Logout successful' });
    } catch (err) {
      console.error('Error logout:', err);
      res.status(500).json({ error: 'Error interno al cerrar sesión' });
    }
  },

  create: async ({ userid, email, password }) => {
    const hash = await bcrypt.hash(password, 10);

    return db.one(
      `INSERT INTO auth (userid, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, userid, email, created_at`,
      [userid, email, hash]
    );
  }

}

module.exports = Auth;*/
