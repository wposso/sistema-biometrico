const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {

  getAll: async () => {
    return db.any(`
      SELECT 
        id,
        document_type_id,
        document_number,
        first_name,
        last_name,
        birth_date,
        city,
        address,
        phone,
        email,
        applied_position,
        experience,
        status_id,
        created_at
      FROM applicants
      ORDER BY created_at DESC
    `);
  },

  create: async ({ type, dni, firstname, lastname, birthday, city, address, phone, email, place, experience }) => {
    //const hash = await bcrypt.hash(password, 10);
    const existing = await db.oneOrNone(
      'SELECT id FROM application_statuses WHERE email=$1',
      [req.body.email]
    );

    if (existing) {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }
    
    return db.one(
      'INSERT INTO applicants(document_type_id, document_number, first_name, last_name, birth_date, city, address, phone, email, applied_position, experience) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
      [type, dni, firstname, lastname, birthday, city, address, phone, email, place, experience]
    );
  },

  findByDni: async (dni) => {
    return db.oneOrNone('SELECT * FROM applicants WHERE document_number=$1', [dni]);
  },

  findById: async (id) => {
    return db.oneOrNone('SELECT * FROM applicants WHERE id=$1', [id]);
  },

  updateData: async (id, fields) => {
    const set = Object.keys(fields).map((key, idx) => `${key}=$${idx + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    return db.one(
      `UPDATE applicants SET ${set} WHERE id=$1 RETURNING *`,
      values
    );
  },

  update: async (id, fields) => {
    const set = Object.keys(fields).map((key, idx) => `${key}=$${idx + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    return db.one(
      `UPDATE applicants SET ${set} WHERE id=$1 RETURNING *`,
      values
    );
  },

  delete: async (id) => {
    return db.none('DELETE FROM applicants WHERE id=$1', [id]);
  },

  verifyPassword: async (user, password) => {
    //const hash = await bcrypt.hash(password, 10);
    return bcrypt.compare(password, user.password_hash);
  }

}

module.exports = User;