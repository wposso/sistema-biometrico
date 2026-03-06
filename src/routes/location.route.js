const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth.middleware');
const locationController = require('../controllers/location.controller');

router.post('/start-journey', ensureAuth, locationController.startJourney);
router.post('/end-journey', ensureAuth, locationController.endJourney);
router.post('/update', ensureAuth, locationController.updateLocation);

module.exports = router;