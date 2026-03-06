const AttendanceModel = require('../models/attendance.model');
const { checkInsideGeofence } = require('../service/geo.service');
const { checkRulesAndCreate } = require('../service/alert.service');
const { emit } = require('../service/socket.service');

const AttendanceController = {
  findById: async (req, res) => {
    try {
      const user_id = req.session.userId;
      const attendance = await AttendanceModel.getByUser(user_id);

      res.json({
        user: {
          id: user_id,
          name: req.session.name,
          role: req.session.role
        },
        attendance
      });
    } catch (err) {
      console.error('Error attendance.me:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  checkIn: async (req, res) => {
    try {
      const user_id = req.session.userId;
      const { latitude, longitude } = req.body;
      const device = req.device;

      if (!device) return res.status(403).json({ error: 'Device no autorizado' });

      const inside_perimeter = await checkInsideGeofence(latitude, longitude);

      const record = await AttendanceModel.create({
        user_id,
        type: 'checkin',
        latitude,
        longitude,
        inside_perimeter,
        device_id: device.id
      });

      const alerts = await checkRulesAndCreate({
        insidePerimeter: inside_perimeter,
        deviceValid: !!device,
        locationReported: true,
        user_id
      });

      emit('checkIn', record);
      alerts.forEach(alert => emit('alert', alert));

      res.json({ record, alerts });
    } catch (err) {
      console.error('Error checkIn:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  checkOut: async (req, res) => {
    try {
      const user_id = req.session.userId;
      const { latitude, longitude } = req.body;
      const device = req.device;

      if (!device) return res.status(403).json({ error: 'Device no autorizado' });

      const inside_perimeter = await checkInsideGeofence(latitude, longitude);

      const record = await AttendanceModel.create({
        user_id,
        type: 'checkout',
        latitude,
        longitude,
        inside_perimeter,
        device_id: device.id
      });

      const alerts = await checkRulesAndCreate({
        insidePerimeter: inside_perimeter,
        deviceValid: !!device,
        locationReported: true,
        user_id
      });

      emit('checkOut', record);
      alerts.forEach(alert => emit('alert', alert));

      res.json({ record, alerts });
    } catch (err) {
      console.error('Error checkOut:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = AttendanceController;




/*const Attendance = require('../models/attendance.model');
const Device = require('../models/device.model');

const { checkInsideGeofence } = require('../service/geo.service');
const { checkRulesAndCreate } = require('../service/alert.service');

const { emit } = require('../service/socket.service');

exports.checkIn = async (req, res) => {
  try {
    const user_id = req.session.userId;
    const { latitude, longitude } = req.body;
    const device = req.device; // viene del device.middleware

    // Validar geocerca
    const inside_perimeter = await checkInsideGeofence(latitude, longitude);

    // Guardar check-in en DB
    const record = await Attendance.checkIn({
      user_id,
      location: { latitude, longitude },
      inside_perimeter,
      device_id: device.id
    });

    // Verificar reglas automáticas
    const alerts = await checkRulesAndCreate({
      insidePerimeter: inside_perimeter,
      deviceValid: !!device,
      locationReported: true,
      user_id
    });

    // Emitir check-in y alertas en tiempo real
    emit('checkIn', record);
    alerts.forEach(alert => emit('alert', alert));

    res.json({ record, alerts });
  } catch (err) {
    console.error('Error check-in:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const user_id = req.session.userId;
    const { latitude, longitude } = req.body;
    const device = req.device;

    // Validar geocerca
    const inside_perimeter = await checkInsideGeofence(latitude, longitude);

    // Guardar check-out en DB
    const record = await Attendance.checkOut({
      user_id,
      location: { latitude, longitude },
      inside_perimeter,
      device_id: device.id
    });

    //  Verificar reglas automáticas
    const alerts = await checkRulesAndCreate({
      insidePerimeter: inside_perimeter,
      deviceValid: !!device,
      locationReported: true,
      user_id
    });

    // Emitir check-out y alertas
    emit('checkOut', record);
    alerts.forEach(alert => emit('alert', alert));

    res.json({ record, alerts });
  } catch (err) {
    console.error('Error check-out:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};*/

