const db = require('../config/db');

exports.checkInsideGeofence = async (lat, lng) => {
  const office = await db.oneOrNone('SELECT id, location, radius_meters FROM offices LIMIT 1');
  if (!office) return true;

  const res = await db.one(
    'SELECT ST_DWithin(ST_GeogFromText($1), location, radius_meters) AS inside',
    [`POINT(${lng} ${lat})`]
  );
  return res.inside;
};