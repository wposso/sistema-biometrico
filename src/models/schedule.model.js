const db = require('../config/db');

const ScheduleModel = {

    findByDniAndDate: async (dni, date) => {
        const query = `
            SELECT scheduleid, dni, type, date, device, longitude, latitude
            FROM schedule
            WHERE dni = $1
            AND date = DATE($2)
            AND type IN (1,2)
            LIMIT 1
        `;

        const result = await db.oneOrNone(query, [dni, date]);

        return result;
    },

    create: async (data) => {
        const query = `
            INSERT INTO schedule
            (dni, type, date, device, longitude, latitude)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.dni,
            data.type,
            data.date,
            data.device,
            data.longitude,
            data.latitude
        ];

        const [result] = await db.query(query, values);

        return {
            scheduleid: result.insertId,
            ...data
        };
    }

};

module.exports = ScheduleModel;