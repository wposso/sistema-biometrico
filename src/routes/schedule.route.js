const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/schedule.controller");


router.post("/scheduleByDni", scheduleController.getByDniAndDate);

router.post("/mark", scheduleController.create);


module.exports = router;