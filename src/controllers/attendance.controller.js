const AttendanceModel = require('../models/attendance.model');
const { checkInsideGeofence } = require('../service/geo.service');
const { checkRulesAndCreate } = require('../service/alert.service');
const { emit } = require('../service/socket.service');

const ScheduleModel = require('../models/schedule.model');
const CompanyModel = require('../models/company.model');
const customResponse = require('../utils/response');

const AttendanceController = {

  getByUser: async (req, res) => {
    try {
      const userId = req.session.userId;
      const attendance = await AttendanceModel.getByUser(userId);

      res.json({
        user: {
          id: userId,
          name: req.session.name,
          role: req.session.role
        },
        attendance
      });
    } catch (e) {
      console.error('Error, schudules of users not found:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  findById: async (req, res) => {
    try {

      const { dni, date } = req.body;

      console.log('cedula', dni);
      console.log('dia', date);

      if (!dni || !date) {
        return res.status(400).json({
          message: "dni y date son requeridos"
        });
      }

      const schedule = await ScheduleModel.findByDniAndDate(dni, date);

      return customResponse(res, 200, 'Data get successful', schedule, false);

    } catch (err) {
      console.error('Error, user not found:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  markedByDay: async (req, res) => {
    const { companycode, dni, entry, date, latitude, longitude, device } = req.body;
    const typin = (entry == 1) ? 'Start' : 'Exit';
    const inArea = false;
    try {

      const company = await CompanyModel.getByCode(companycode);
      if (!company) {
        return customResponse(res, 404, 'Company not found', null, true);
      }

      const marked = await AttendanceModel.getMarkedByDay(dni, entry);
      if (marked && marked.length > 0) {
        return customResponse(res, 400, typin + ' is already registered', null, true);
      }

      if (entry == 1) {
        const toRad = (value) => (value * Math.PI) / 180;

        const lat1 = parseFloat(company.latitude);
        const lon1 = parseFloat(company.longitude);
        const lat2 = parseFloat(latitude);
        const lon2 = parseFloat(longitude);

        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        inArea = distance > company.perimeter;
      }

      /*const toRad = (value) => (value * Math.PI) / 180;

      const lat1 = parseFloat(company.latitude);
      const lon1 = parseFloat(company.longitude);
      const lat2 = parseFloat(latitude);
      const lon2 = parseFloat(longitude);

      const R = 6371000;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      const inArea = distance > company.perimeter;*/
      if (inArea) {
        return customResponse(res, 400, 'Outside the permitted area', null, true);
      } else {
        const schedule = await AttendanceModel.markWorkDay({ dni, entry, date, latitude, longitude, device });
        if (entry == 1 && typeof emit === "function") emit('checkIn', schedule);
        if (entry == 2 && typeof emit === "function") emit('checkOut', schedule);

        //alerts.forEach(alert => emit('alert', alert));
        /*res.json({ record, alerts });*/

        //res.status(201).json(schedule, alerts);

        return customResponse(res, 200, typin + ' registered successfully', schedule, true);
      }

    } catch (error) {
      return customResponse(res, 500, 'Error saving schedule', null, true);
    }
  },

  /*checkIn_bad: async (req, res) => {
    try {
      const userId = req.session.userId;
      const { latitude, longitude } = req.body;
      const device = req.device;

      if (!device) return res.status(403).json({ error: 'Device no autorizado' });

      const inside_perimeter = await checkInsideGeofence(latitude, longitude);

      const record = await AttendanceModel.create({
        userId,
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
        userId
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
  }*/
};

module.exports = AttendanceController;
