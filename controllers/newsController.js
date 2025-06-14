const { New } = require('../models/New');
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

exports.validateCreate = [
    body('title')
        .isString().withMessage('title debe ser una cadena de texto')
        .notEmpty().withMessage('title no puede estar vacío'),
    body('content')
        .isString().withMessage('content debe ser una cadena de texto')
        .notEmpty().withMessage('content no puede estar vacío'),
    body('date')
        .isISO8601().toDate().withMessage('date debe ser una fecha válida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateUpdate = [
    param('id')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo'),
    body('title')
        .optional()
        .isString().withMessage('title debe ser una cadena de texto')
        .notEmpty().withMessage('title no puede estar vacío'),
    body('content')
        .optional()
        .isString().withMessage('content debe ser una cadena de texto')
        .notEmpty().withMessage('content no puede estar vacío'),
    body('date')
        .optional()
        .isISO8601().toDate().withMessage('date debe ser una fecha válida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.getAll = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        // Solo noticias favoritas del usuario autenticado
        const news = await New.findAll({ where: { userId: req.user.id } });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener noticias', error });
    }
};

exports.getById = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const new_ = await New.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (new_) res.json(new_);
        else res.status(404).json({ message: 'Noticia no encontrada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener noticia', error });
    }
};

exports.create = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        // Evita duplicados por url para el usuario
        const exists = await New.findOne({ where: { url: req.body.url, userId: req.user.id } });
        if (exists) return res.status(200).json(exists);

        const newNew = await New.create({
            name: req.body.name,
            content: req.body.content || "",
            image: req.body.image || "",
            url: req.body.url,
            userId: req.user.id,
        });
        res.status(201).json(newNew);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear noticia', error });
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const new_ = await New.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!new_) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }
        // Solo permite actualizar el campo content (nota)
        if (req.body.content !== undefined) {
            new_.content = req.body.content;
        }
        await new_.save();
        res.json(new_);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar noticia', error });
    }
};

exports.remove = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        const deleted = await New.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (deleted) {
            res.json({ message: 'Noticia eliminada' });
        } else {
            res.status(404).json({ message: 'Noticia no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar noticia', error });
    }
};
