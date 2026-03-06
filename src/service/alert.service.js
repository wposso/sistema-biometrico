const Alert = require('../models/alert.model');
const { emit } = require('./socket.service');
const db = require('../config/db');

/**
 * Crear alerta y notificar en tiempo real
 * @param {Object} params
 * @param {string} params.user_id - ID del usuario
 * @param {string} params.type - Tipo de alerta (ej: 'Fuera de geocerca')
 * @param {string} params.description - Descripción de la alerta
 */
async function createAlert({ user_id, type, description }) {
  // Crear registro en DB
  const alert = await Alert.create({ user_id, type, description });

  // Emitir por socket.io para dashboard
  emit('alert', alert);

  return alert;
}

/**
 * Resolver alerta
 * @param {string} alertId - ID de la alerta
 */
async function resolveAlert(alertId) {
  const alert = await Alert.resolve(alertId);

  // Emitir actualización en tiempo real
  emit('alertResolved', alert);

  return alert;
}

/**
 * Generar alertas automáticas según reglas
 * @param {Object} params
 * @param {boolean} params.insidePerimeter - true si el usuario está dentro de geocerca
 * @param {boolean} params.deviceValid - true si el dispositivo está autorizado
 * @param {boolean} params.locationReported - true si el usuario reportó ubicación en tiempo
 * @param {string} params.user_id
 */
async function checkRulesAndCreate({ insidePerimeter, deviceValid, locationReported, user_id }) {
  const alerts = [];

  if (!insidePerimeter) {
    alerts.push(await createAlert({
      user_id,
      type: 'Fuera de geocerca',
      description: 'Marca realizada fuera del perímetro permitido'
    }));
  }

  if (!deviceValid) {
    alerts.push(await createAlert({
      user_id,
      type: 'Dispositivo no autorizado',
      description: 'Usuario intenta usar un device no registrado'
    }));
  }

  if (!locationReported) {
    alerts.push(await createAlert({
      user_id,
      type: 'No reporta ubicación',
      description: 'Usuario no reporta ubicación desde hace X minutos'
    }));
  }

  return alerts;
}

/**
 * Obtener todas las alertas
 */
async function getAllAlerts() {
  return Alert.getAll();
}

module.exports = {
  createAlert,
  resolveAlert,
  checkRulesAndCreate,
  getAllAlerts
};