const pgp = require('pg-promise')();
//const db = pgp(process.env.DATABASE_URL || 'postgres://postgres:147896321@localhost:5432/sofidya');
const db = pgp(process.env.DATABASE_URL);

module.exports = db;


