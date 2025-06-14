const User = require('../models/User');
const { param, body, validationResult } = require('express-validator');

exports.validateIdParam = [
    param('id')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateCreateUser = [
    body('username')
        .isString().withMessage('username debe ser una cadena de texto')
        .notEmpty().withMessage('username no puede estar vacío'),
    body('email')
        .isEmail().withMessage('Debe ser un email válido')
        .notEmpty().withMessage('email no puede estar vacío'),
    body('password')
        .isLength({ min: 6 }).withMessage('password debe tener al menos 6 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateUpdateUser = [
    param('id')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo'),
    body('username')
        .optional()
        .isString().withMessage('username debe ser una cadena de texto')
        .notEmpty().withMessage('username no puede estar vacío'),
    body('email')
        .optional()
        .isEmail().withMessage('Debe ser un email válido')
        .notEmpty().withMessage('email no puede estar vacío'),
    body('password')
        .optional()
        .isLength({ min: 6 }).withMessage('password debe tener al menos 6 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario', error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error al crear el usuario', error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Si solo se quiere actualizar el nombre de usuario (nickName)
        if (req.body.username !== undefined) {
            user.nickName = req.body.username;
        }
        // Si se permite actualizar otros campos, agregarlos aquí
        if (req.body.email !== undefined) {
            user.email = req.body.email;
        }
        if (req.body.password !== undefined) {
            user.password = req.body.password;
        }
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al actualizar el usuario', error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar el usuario', error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
}
