const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { ensureAuth } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

const { isAdmin } = require('../middleware/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: CRUD de usuarios / aplicaciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *         dni:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *         city:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         place:
 *           type: string
 *         experience:
 *           type: string
 *       required:
 *         - type
 *         - dni
 *         - firstname
 *         - lastname
 *         - email
 */

/**
 * @swagger
 * /users/getAll:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       document_type_id:
 *                         type: string
 *                       document_number:
 *                         type: string
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       birth_date:
 *                         type: string
 *                         format: date
 *                       city:
 *                         type: string
 *                       address:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *                       applied_position:
 *                         type: string
 *                       experience:
 *                         type: string
 *                       status_id:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/findByDni/{dni}:
 *   get:
 *     summary: Obtener usuario por DNI
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: dni
 *         schema:
 *           type: string
 *         required: true
 *         description: DNI del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /users/updateData/{id}:
 *   put:
 *     summary: Actualizar datos del usuario (self-update)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Campos a actualizar por el mismo usuario
 *             example:
 *               firstname: Juan
 *               city: Ciudad Nueva
 *     responses:
 *       200:
 *         description: Datos del usuario actualizados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/findById/{id}:
 *   get:
 *     summary: Obtener usuario por ID (solo admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Actualizar usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Campos a actualizar por admin
 *             example:
 *               firstname: Juan
 *               city: Ciudad Nueva
 *     responses:
 *       200:
 *         description: Usuario actualizado por admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado correctamente"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */

router.get('/getAll', UserController.getAll);
router.post('/create', UserController.create);
router.get('/findByDni/:dni', ensureAuth, UserController.getByDni);
router.put('/updateData/:id', ensureAuth, UserController.updateData);
router.get('/findById/:id', ensureAuth, isAdmin, UserController.getById);
router.put('/update/:id', ensureAuth, isAdmin, UserController.update);
router.delete('/delete/:id', ensureAuth, isAdmin, UserController.delete);

module.exports = router;