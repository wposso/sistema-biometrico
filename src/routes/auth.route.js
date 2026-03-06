const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /Auth/login:
 *   post:
 *     summary: Login de usuario con device binding
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - device_uuid
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@empresa.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               device_uuid:
 *                 type: string
 *                 example: "abc123-device-id"
 *               platform:
 *                 type: string
 *                 example: "Android"
 *               model:
 *                 type: string
 *                 example: "Samsung S21"
 *               os_version:
 *                 type: string
 *                 example: "13"
 *     responses:
 *       200:
 *         description: Login exitoso, sessionID generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 sessionID:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Credenciales inválidas
 *       403:
 *         description: Otro device activo
 */

/**
 * @swagger
 * /Auth/logout:
 *   post:
 *     summary: Logout de usuario y destrucción de sessionID
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 */

/**
 * @swagger
 * /Auth/applicant/search:
 *   post:
 *     summary: Buscar aplicante por documento y empresa
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentNumber
 *               - documentTypeId
 *               - companyCode
 *             properties:
 *               documentNumber:
 *                 type: string
 *                 example: "100000007"
 *               documentTypeId:
 *                 type: integer
 *                 example: 1
 *               companyCode:
 *                 type: string
 *                 example: "IQ123"
 *     responses:
 *       200:
 *         description: Aplicante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applicant:
 *                   type: object
 *                   properties:
 *                     applicantid:
 *                       type: integer
 *                       example: 15
 *                     document_number:
 *                       type: string
 *                       example: "100000007"
 *                     document_type_id:
 *                       type: integer
 *                       example: 1
 *                     status_id:
 *                       type: integer
 *                       example: 1
 *                     companyid:
 *                       type: integer
 *                       example: 3
 *                     companycode:
 *                       type: string
 *                       example: "IQ123"
 *       404:
 *         description: No se encontró el aplicante
 *       500:
 *         description: Error interno del servidor
 */

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post("/applicant/search", authController.getApplicant);
router.post('/renew', authController.renew);
router.put('/change-password', authController.changePassword);

module.exports = router;


/*
//Para rutas donde varios roles tengan acceso (ej. check-in):
const { authorizeRoles } = require('../middlewares/role.middleware');

router.post('/check-in', ensureAuth, verifyDevice, authorizeRoles(['vendedor','planta']), attendanceController.checkIn);

*/