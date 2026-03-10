const db = require('../config/db');

const Company = {

  getAll: async () => {
    return db.manyOrNone('SELECT * FROM company');
  },

  getById: async (id) => {
    return db.oneOrNone('SELECT * FROM companyid WHERE id=$1', [id]);
  },

  getByCode: async (code) => {
    return db.oneOrNone('SELECT * FROM company WHERE companycode=$1', [code]);
  }
}

module.exports = Company;