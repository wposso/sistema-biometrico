const Device = require('../models/device.model');
const { createAlert } = require('../service/alert.service');

async function verifyDevice(req, res, next) {
  try {
    const user_id = req.session.userId;
    const device_uuid = req.body.device_uuid || req.headers['x-device-uuid'];

    if (!device_uuid) {
      return res.status(400).json({ error: 'device_uuid es requerido' });
    }

    const device = await Device.findByUserAndUUID(user_id, device_uuid);

    if (!device) {
      // Genera alerta de intento con device no autorizado
      await createAlert({
        user_id,
        type: 'Dispositivo no autorizado',
        description: `Intento de acción con device no registrado: ${device_uuid}`
      });

      return res.status(403).json({ error: 'Device no autorizado' });
    }

    // Si todo ok, attach device al request para uso posterior
    req.device = device;

    next();
  } catch (err) {
    console.error('Error en device middleware:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { verifyDevice };