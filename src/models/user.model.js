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

  create: async ({ type, dni, firstname, lastname, birthday, city, address, phone, email, place, experience, companycode }) => {

    const existing = await db.oneOrNone(
      'SELECT id FROM applicants WHERE email=$1',
      [email]
    );

    if (existing) {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }

    /*const companyid = await db.none(
      'SELECT companyid FROM company WHERE companycode=$1',
      [companycode]
    );  */

    const companyRow = await db.oneOrNone(
      'SELECT companyid FROM company WHERE companycode=$1',
      [companycode]
    );

    if (!companyRow) throw new Error('Company no encontrada');

    const companyid = companyRow.companyid;

    return db.one(
      'INSERT INTO applicants(document_type_id, document_number, first_name, last_name, birth_date, city, address, phone, email, applied_position, experience, companyid) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
      [type, dni, firstname, lastname, birthday, city, address, phone, email, place, experience, companyid]
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

  verifyPassword: async (password) => {
    const psw = await db.oneOrNone(
      'SELECT password FROM auth WHERE password=$1',
      [email]
    );

    const hash = await bcrypt.hash(password, 10);
    return bcrypt.compare(hash, psw);
  } 

}

module.exports = User;