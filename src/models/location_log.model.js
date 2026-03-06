const db = require('../config/db');

class LocationLog {
  static async startJourney({ user_id }) {
    return db.one(
      'INSERT INTO journeys(user_id, start_time) VALUES($1,NOW()) RETURNING *',
      [user_id]
    );
  }

  static async endJourney({ user_id }) {
    return db.one(
      'UPDATE journeys SET end_time=NOW() WHERE user_id=$1 AND end_time IS NULL RETURNING *',
      [user_id]
    );
  }

  static async log({ user_id, latitude, longitude, speed, battery_level }) {
    return db.one(
      'INSERT INTO location_logs(user_id,location,speed,battery_level) VALUES($1,ST_GeographyFromText($2),$3,$4) RETURNING *',
      [user_id, `POINT(${longitude} ${latitude})`, speed, battery_level]
    );
  }
}

module.exports = LocationLog;