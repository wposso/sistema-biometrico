const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/MobileEngine/v1/auth/loginBiometric:
 *   post:
 *     summary: Login biométrico de un empleado por documento y empresa
 *     tags: [Auth Mobile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:              
 *               - type
 *               - dni
 *               - code
 *             properties:
 *               type:
 *                 type: integer
 *                 example: 1
 *               dni:
 *                 type: string
 *                 example: "100000001"              
 *               code:
 *                 type: string
 *                 example: "IQ123"
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Willington"
 *                     last_name:
 *                       type: string
 *                       example: "Posso"
 *                     status:
 *                       type: integer
 *                       example: 1
 *                 company:
 *                   type: object
 *                   properties:
 *                     companyid:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "IQ Sysyem S.A.S"
 *                 schedule:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2026-03-06"
 *                     start_time:
 *                       type: string
 *                       example: "08:00:00"
 *                     end_time:
 *                       type: string
 *                       example: "17:00:00"
 *       404:
 *         description: No se encontró el empleado
 *       500:
 *         description: Error interno del servidor
 */

router.post('/loginBiometric', authController.loginBiometric);

module.exports = router;