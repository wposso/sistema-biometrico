const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth.middleware');
const reportController = require('../controllers/report.controller');

router.get('/attendance', ensureAuth, reportController.attendanceReport);
router.get('/export-pdf', ensureAuth, reportController.exportPDF);

module.exports = router;