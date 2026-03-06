const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');

const { ensureAuth } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');
const { isVendedor } = require('../middlewares/role.middleware');

router.post('/request-device-change', ensureAuth, deviceController.requestDeviceChange);

// Revisar solicitud (admin)
router.patch(
  '/device-change/:id/review',
  ensureAuth,
  isAdmin,
  deviceController.reviewDeviceChange
);

module.exports = router;