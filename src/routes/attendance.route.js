const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth.middleware');
const { verifyDevice } = require('../middleware/device.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const attendanceController = require('../controllers/attendance.controller');

const { isAdmin } = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Endpoints de asistencia
 */

/**
 * @swagger
 * /attendance/me:
 *   get:
 *     summary: Obtener historial de asistencia del usuario logueado
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: Lista de check-ins y check-outs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 attendance:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       server_timestamp:
 *                         type: string
 *                       inside_perimeter:
 *                         type: boolean
 */

/**
 * @swagger
 * /check-in:
 *   post:
 *     summary: Registrar check-in del usuario
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 19.4326
 *               longitude:
 *                 type: number
 *                 example: -99.1332
 *     responses:
 *       200:
 *         description: Check-in registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 record:
 *                   type: object
 *                 alerts:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /check-out:
 *   post:
 *     summary: Registrar check-out del usuario
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 19.4326
 *               longitude:
 *                 type: number
 *                 example: -99.1332
 *     responses:
 *       200:
 *         description: Check-out registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 record:
 *                   type: object
 *                 alerts:
 *                   type: array
 *                   items:
 *                     type: object
 */

router.get('/attendance/me', ensureAuth, isAdmin, attendanceController.findById);
router.post('/check-in', ensureAuth, verifyDevice, attendanceController.checkIn);
router.post('/check-out', ensureAuth, verifyDevice, attendanceController.checkOut);

module.exports = router;