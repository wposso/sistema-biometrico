const ScheduleModel = require('../models/schedule.model');

const ScheduleController = {

    getByDniAndDate: async (req, res) => {
        try {
            const { dni, date } = req.body;

            if (!dni || !date) {
                return res.status(400).json({
                    message: "dni y date son requeridos"
                });
            }

            const schedule = await ScheduleModel.findByDniAndDate(dni, date);

            return res.json(schedule);
            
        } catch (error) {
            res.status(500).json({
                message: "Error consultando schedule",
                error: error.message
            });
        }
    },

    create: async (req, res) => {
        try {
            const schedule = await ScheduleModel.create(req.body);
            res.status(201).json(schedule);
        } catch (error) {
            res.status(500).json({
                message: "Error guardando schedule",
                error: error.message
            });
        }
    }

};

module.exports = ScheduleController;