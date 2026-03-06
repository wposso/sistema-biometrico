const db = require('../config/db');
const Device = require('../models/device.model');

exports.requestDeviceChange = async (req, res) => {
  try {
    const user_id = req.session.userId;
    const { device_uuid, platform, model, os_version } = req.body;

    const result = await db.one(
      `INSERT INTO device_change_requests (user_id, device_uuid, platform, model, os_version)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [user_id, device_uuid, platform, model, os_version]
    );

    // Emitir alerta al dashboard admin
    emit('alert', {
      type: 'Solicitud de device',
      description: `Usuario ${user_id} solicita registrar un nuevo device`,
      user_id
    });

    res.json({ message: 'Solicitud enviada y pendiente de aprobación', request: result });

  } catch (err) {
    console.error('Error solicitud device:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PATCH /api/auth/device-change/:id/approve
exports.reviewDeviceChange = async (req, res) => {
  try {
    const admin_id = req.session.userId; // admin autenticado
    const { status } = req.body; // 'approved' o 'rejected'
    const request_id = req.params.id;

    const request = await db.oneOrNone('SELECT * FROM device_change_requests WHERE id=$1', [request_id]);
    if (!request) return res.status(404).json({ error: 'Solicitud no encontrada' });

    if (!['approved','rejected'].includes(status)) return res.status(400).json({ error: 'Status inválido' });

    await db.none(
      `UPDATE device_change_requests 
       SET status=$1, reviewed_by=$2, reviewed_at=NOW() 
       WHERE id=$3`,
      [status, admin_id, request_id]
    );

    if (status === 'approved') {
      // Registrar device
      await db.none(
        `INSERT INTO devices (user_id, device_uuid, platform, model, os_version, is_active)
         VALUES ($1,$2,$3,$4,$5,true)`,
        [request.user_id, request.device_uuid, request.platform, request.model, request.os_version]
      );
    }

    // Emitir alerta al vendedor
    emit('alert', {
      type: 'Device ' + status,
      description: `Solicitud de device ${status} por admin`,
      user_id: request.user_id
    });

    res.json({ message: `Solicitud ${status}` });

  } catch (err) {
    console.error('Error review device:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};