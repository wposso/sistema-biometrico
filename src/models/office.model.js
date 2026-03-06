const db = require('../config/db');

class Office {
  static async getAll() {
    return db.manyOrNone('SELECT * FROM offices');
  }

  static async getById(id) {
    return db.oneOrNone('SELECT * FROM offices WHERE id=$1', [id]);
  }
}

module.exports = Office;