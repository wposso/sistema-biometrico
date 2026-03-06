const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth.middleware');
const alertController = require('../controllers/alert.controller');

router.get('/', ensureAuth, alertController.getAlerts);
router.patch('/:id/resolve', ensureAuth, alertController.resolveAlert);

module.exports = router;