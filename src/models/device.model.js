
const db = require('../config/db');

class Device {
  static async bindDevice(user_id, device_uuid) {
    // Desactivar otros devices
    await db.none('UPDATE devices SET is_active=false WHERE user_id=$1', [user_id]);
    return db.one(
      'INSERT INTO devices(user_id, device_uuid, is_active) VALUES($1,$2,true) RETURNING *',
      [user_id, device_uuid]
    );
  }

  static async findActiveByUser(user_id) {
    return db.oneOrNone('SELECT * FROM devices WHERE user_id=$1 AND is_active=true', [user_id]);
  }

  static async findByUserAndUUID(user_id, device_uuid) {
    return db.oneOrNone('SELECT * FROM devices WHERE user_id=$1 AND device_uuid=$2 AND is_active=true', [user_id, device_uuid]);
  }
}

module.exports = Device;