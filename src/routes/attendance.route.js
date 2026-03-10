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
 * /attendance/all:
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
 * /attendance/find-me:
 *   post:
 *     summary: Buscar asistencia de usuario por DNI y fecha
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 example: "12345678"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-10"
 *     responses:
 *       200:
 *         description: Información de asistencia encontrada o null si no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               nullable: true
 *               properties:
 *                 scheduleid:
 *                   type: integer
 *                   example: 12
 *                 dni:
 *                   type: string
 *                   example: "12345678"
 *                 type:
 *                   type: integer
 *                   example: 1
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2026-03-10"
 *                 device:
 *                   type: string
 *                   example: "mobile"
 *                 longitude:
 *                   type: string
 *                   example: "-75.5636"
 *                 latitude:
 *                   type: string
 *                   example: "6.2518"
 */

/**
 * @swagger
 * /attendance/check-in:
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
 *               companycode:
 *                 type: string
 *                 example: "ABC123"
 *               dni:
 *                 type: string
 *                 example: "12345678"
 *               entry:
 *                   type: integer
 *                   example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-10"
 *               latitude:
 *                 type: number
 *                 example: 19.4326
 *               longitude:
 *                 type: number
 *                 example: -99.1332
 *               device:
 *                 type: string
 *                 example: "0012-5024-0000"
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
 * /attendance/check-out:
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
 *               companycode:
 *                 type: string
 *                 example: "ABC123"
 *               dni:
 *                 type: string
 *                 example: "12345678"
 *               entry:
 *                   type: integer
 *                   example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-10"
 *               latitude:
 *                 type: number
 *                 example: 19.4326
 *               longitude:
 *                 type: number
 *                 example: -99.1332
 *               device:
 *                 type: string
 *                 example: "0012-5024-0000"
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

//router.get('/all', ensureAuth, isAdmin, attendanceController.all);
router.post('/find-me', attendanceController.findById);
//router.post('/check-in', ensureAuth, verifyDevice, attendanceController.checkIn);
router.post('/check-in', attendanceController.markedByDay);
//router.post('/check-out', ensureAuth, verifyDevice, attendanceController.checkOut);
router.post('/check-out', attendanceController.markedByDay);

module.exports = router;