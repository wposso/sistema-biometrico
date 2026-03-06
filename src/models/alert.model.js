const db = require('../config/db');

class Alert {
  static async create({ user_id, type, description }) {
    return db.one(
      'INSERT INTO alerts(user_id,type,description) VALUES($1,$2,$3) RETURNING *',
      [user_id, type, description]
    );
  }

  static async resolve(id) {
    return db.one(
      'UPDATE alerts SET resolved=true WHERE id=$1 RETURNING *',
      [id]
    );
  }

  static async getAll() {
    return db.manyOrNone('SELECT * FROM alerts ORDER BY created_at DESC');
  }
}

module.exports = Alert;