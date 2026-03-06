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

  getByUser: async (user_id) => {
    return db.any(
      'SELECT id, type, server_timestamp, inside_perimeter FROM attendance WHERE user_id=$1 ORDER BY server_timestamp DESC',
      [user_id]
    );
  },

  checkIn: async ({ user_id, type, latitude, longitude, inside_perimeter, device_id }) => {
    return db.one(
      `INSERT INTO attendance (user_id, type, location, inside_perimeter, device_id)
       VALUES ($1, $2, ST_GeographyFromText('POINT(' || $3 || ' ' || $4 || ')'), $5, $6)
       RETURNING *`,
      [user_id, type, longitude, latitude, inside_perimeter, device_id]
    );
  }, 

  checkOut: async ({ user_id, type, latitude, longitude, inside_perimeter, device_id }) => {
    return db.one(
      `INSERT INTO attendance (user_id, type, location, inside_perimeter, device_id)
       VALUES ($1, $2, ST_GeographyFromText('POINT(' || $3 || ' ' || $4 || ')'), $5, $6)
       RETURNING *`,
      [user_id, type, longitude, latitude, inside_perimeter, device_id]
    );
  }
}

module.exports = Attendance;