const LocationLog = require('../models/location_log.model');

exports.startJourney = async (req, res) => {
  const user_id = req.session.userId;
  const journey = await LocationLog.startJourney({ user_id });
  res.json(journey);
};

exports.endJourney = async (req, res) => {
  const user_id = req.session.userId;
  const journey = await LocationLog.endJourney({ user_id });
  res.json(journey);
};

exports.updateLocation = async (req, res) => {
  const user_id = req.session.userId;
  const { latitude, longitude, speed, battery_level } = req.body;

  const log = await LocationLog.log({ user_id, latitude, longitude, speed, battery_level });
  res.json(log);
};