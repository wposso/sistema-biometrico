const db = require('../config/db');
const bcrypt = require('bcrypt');

const AuthModel = {

  findUser: async (email) => {
    const auth = await db.query(`
      SELECT userid, profile
      FROM auth
      WHERE email = $1
      `, [email])

    switch (auth.profile) {
      case 1:
        user = await db.query(`
          SELECT * FROM admin
          WHERE adminid = $1
        `, [auth.userid])
        break

      case 2:
        user = await db.query(`
          SELECT * FROM company
          WHERE companyid = $1
        `, [auth.userid])
        break

      case 3:
        user = await db.query(`
          SELECT * FROM employee
          WHERE employeeid = $1
        `, [auth.userid])
        break
    }

    return auth;

    /*return db.oneOrNone(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );*/
  },

  insertSession: async ({ userId, sessionId, deviceId }) => {
    return db.none(
      `INSERT INTO user_session (userid, sessionid, deviceid, expires_at)
       VALUES ($1, $2, $3, NOW() + interval '1 hour')`,
      [userId, sessionId, deviceId]
    );
  },

  deleteSession: async (sessionId) => {
    return db.none(
      `DELETE FROM user_session WHERE sessionid=$1`,
      [sessionId]
    );
  },

  createAuthUser: async ({ userid, email, password }) => {
    const hash = await bcrypt.hash(password, 10);

    return db.one(
      `INSERT INTO auth (userid, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, userid, email, created_at`,
      [userid, email, hash]
    );
  },

  validateSession: async (sessionId) => {
    return db.oneOrNone(
      `SELECT *
     FROM user_session
     WHERE sessionid = $1
     AND expires_at > NOW()`,
      [sessionId]
    );
  },

  updateSession: async (sessionId) => {
    return db.none(
      `UPDATE user_session
     SET expires_at = NOW() + interval '1 hour'
     WHERE sessionid = $1`,
      [sessionId]
    );
  },

  validateForRenew: async (sessionId, graceMinutes = 5) => {
    return db.oneOrNone(
      `SELECT *
       FROM user_session
       WHERE sessionid = $1
       AND expires_at > NOW() - interval '${graceMinutes} minutes'`,
      [sessionId]
    );
  },

  findByMail: async (email) => {
    return db.oneOrNone('SELECT * FROM auth WHERE email=$1', [email]);
  },

  changePassword: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await AuthModel.findByMail(email);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error("La contraseña actual es incorrecta");
      }

      const newHash = await bcrypt.hash(password, 10);

      user.password = newHash;
      await AuthModel.updatePassword(email, newHash);

      return true;

    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (email, password) => {
    return db.none(
      `UPDATE auth
     SET password = $2
     WHERE email = $1`,
      [email, password]
    );
  },

  getApplication: async (documentNumber, documentTypeId, companyCode) => {
    return db.oneOrNone(`
      SELECT *
      FROM applicants ap
      INNER JOIN company c ON c.companyid = ap.companyid
      WHERE ap.document_number = $1
      AND ap.document_type_id = $2
      AND ap.status_id = 1
      AND c.companycode = $3
    `, [documentNumber,
        documentTypeId,
        companyCode]);
  },

  loginBiometric: async (type, dni, code) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    return db.oneOrNone(
      `SELECT 
          ap.first_name, 
          ap.last_name, 
          emp.status as emp_status, 
          c.companyid, 
          c.nit, 
          c.name,
          sc.*
      FROM applicants ap
      INNER JOIN company c 
          ON c.companyid = ap.companyid
      JOIN employees emp 
          ON ap.id = emp.applicant_id
      LEFT JOIN schedule sc 
          ON ap.document_number = sc.dni
            AND DATE(sc.date) = $4
      WHERE ap.document_number = $2
        AND ap.document_type_id = $1
        AND emp.status = 1
        AND c.companycode = $3;      
      `
      , [type, dni, code, today]);
  }

};

module.exports = AuthModel;