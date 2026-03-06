const Alert = require('../models/alert.model');

exports.getAlerts = async (req, res) => {
  const alerts = await Alert.getAll();
  res.json(alerts);
};

exports.resolveAlert = async (req, res) => {
  const { id } = req.params;
  const alert = await Alert.resolve(id);
  res.json(alert);
};