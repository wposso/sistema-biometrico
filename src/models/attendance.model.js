const db = require('../config/db');

const Attendance = {
  /*static async checkIn({ user_id, location, inside_perimeter, device_id }) {
    return db.one(
      'INSERT INTO attendance(user_id,type,location,inside_perimeter,device_id) VALUES($1,$2,ST_GeographyFromText($3),$4,$5) RETURNING *',
      [user_id, 'checkin', `POINT(${location.longitude} ${location.latitude})`, inside_perimeter, device_id]
    );
  }*/

  /*static async checkOut({ user_id, location, inside_perimeter, device_id }) {
    return db.one(
      'INSERT INTO attendance(user_id,type,location,inside_perimeter,device_id) VALUES($1,$2,ST_GeographyFromText($3),$4,$5) RETURNING *',
      [user_id, 'checkout', `POINT(${location.longitude} ${location.latitude})`, inside_perimeter, device_id]
    );
  }*/

  getByUser: async (dni) => {
    return db.any(
      'SELECT type, date FROM attendance WHERE dni = $1 ORDER BY date DESC',
      [dni]
    );
  },

  getMarkedByDay: async (dni, entry) => {
    return db.any(
      'SELECT type, date FROM schedule WHERE dni = $1 AND type = $2 AND DATE(date) = CURRENT_DATE',
      [dni, entry]
    );
  },

  markWorkDay: async ({ dni, entry, date, device, latitude, longitude }) => {
    try {
      const query = `
      INSERT INTO schedule
        (dni, type, date, device, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING scheduleid
    `;

      const values = [dni, entry, date, device, latitude, longitude];

      if (values.some(v => v === undefined || v === null)) {
        throw new Error("Uno o más valores no están definidos: " + JSON.stringify({ dni, entry, date, device, latitude, longitude }));
      }

      const result = await db.one(query, values);

      console.log('result db => ', result);

      return {
        scheduleid: result.scheduleid
      };
    } catch (err) {
      console.error('Error en markWorkDay:', err);
      throw err;
    }
  }

  /*checkIn: async ({ user_id, type, latitude, longitude, inside_perimeter, device_id }) => {
    return db.one(
      `INSERT INTO attendance (user_id, type, location, inside_perimeter, device_id)
       VALUES ($1, $2, ST_GeographyFromText('POINT(' || $3 || ' ' || $4 || ')'), $5, $6)
       RETURNING *`,
      [user_id, type, longitude, latitude, inside_perimeter, device_id]
    );
  },*/

  /*checkOut: async ({ user_id, type, latitude, longitude, inside_perimeter, device_id }) => {
    return db.one(
      `INSERT INTO attendance (user_id, type, location, inside_perimeter, device_id)
       VALUES ($1, $2, ST_GeographyFromText('POINT(' || $3 || ' ' || $4 || ')'), $5, $6)
       RETURNING *`,
      [user_id, type, longitude, latitude, inside_perimeter, device_id]
    );
  }*/
}

module.exports = Attendance;