const User = require('../models/user.model');
const Auth = require('../models/auth.model')

const UserController = {

    getAll: async (req, res) => {
        try {
            const users = await User.getAll();
            res.json({ users });
        } catch (err) {
            console.error('Error obteniendo usuarios:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    create: async (req, res) => {
        try {

            //falta validar que el usuario no este creado ya en esa empresa y si no lo esta, que lo cree

            const user = await User.create(req.body);

            const passwordFinal =
                req.body.password && req.body.password.trim() !== ''
                    ? req.body.password
                    : user.document_number;

            const authUser = await Auth.createAuthUser({
                userid: user.id,
                email: user.email,
                password: passwordFinal
            });

            res.json({ message: 'Usuario creado', user, authUser });
        } catch (err) {
            console.error("🔥 ERROR REAL:", err);
            if (err.code === '23505') {
                return res.status(400).json({
                    error: 'El correo ya está registrado'
                });
            }
            res.status(500).json({
                error: "Error interno del servidor",
                detail: err.message
            });
        }
        /*catch (err) {
            console.error('Error creando usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }*/
    },

    getByDni: async (req, res) => {
        try {
            const user = await User.findByDni(req.params.dni);
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json(user);
        } catch (err) {
            console.error('Error buscando usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    getById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json(user);
        } catch (err) {
            console.error('Error buscando usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    updateData: async (req, res) => {
        try {
            const updatedUser = await User.updateData(req.params.id, req.body);
            res.json({ message: 'Usuario actualizado', user: updatedUser });
        } catch (err) {
            console.error('Error actualizando usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    update: async (req, res) => {
        try {
            const updatedUser = await User.update(req.params.id, req.body);
            res.json({ message: 'Usuario actualizado', user: updatedUser });
        } catch (err) {
            console.error('Error actualizando usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    delete: async (req, res) => {
        try {
            await User.delete(req.params.id);
            res.json({ message: 'Usuario eliminado' });
        } catch (err) {
            console.error('Error eliminando usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

};

module.exports = UserController;