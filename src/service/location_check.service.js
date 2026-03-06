const db = require('../config/db');
const { checkRulesAndCreate } = require('./alert.service');

async function checkInactiveVendors(minutes = 15) {
  const now = new Date();
  const threshold = new Date(now.getTime() - minutes * 60 * 1000);

  const vendors = await db.manyOrNone(
    `SELECT id, name FROM employees WHERE position=6 AND status=1`
  );

  for (const vendor of vendors) {
    const lastLocation = await db.oneOrNone(
      `SELECT server_timestamp FROM location_logs 
       WHERE position=$1 
       ORDER BY server_timestamp DESC 
       LIMIT 1`,
      [vendor.id]
    );

    const locationReported = lastLocation && new Date(lastLocation.server_timestamp) > threshold;

    if (!locationReported) {
      await checkRulesAndCreate({
        insidePerimeter: true,
        deviceValid: true,
        locationReported,
        user_id: vendor.id
      });
    }
  }
}

module.exports = { checkInactiveVendors };