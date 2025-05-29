const { PriceHistory } = require('../models/PriceHistory');
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
    body('assetId')
        .isInt({ gt: 0 }).withMessage('assetId debe ser un número entero positivo'),
    body('price')
        .isFloat({ gt: 0 }).withMessage('price debe ser un número mayor a 0'),
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
    body('assetId')
        .optional()
        .isInt({ gt: 0 }).withMessage('assetId debe ser un número entero positivo'),
    body('price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('price debe ser un número mayor a 0'),
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
        const priceHistories = await PriceHistory.findAll();
        res.json(priceHistories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener registros de precios', error });
    }
};

exports.getById = async (req, res) => {
    try {
        const priceHistory = await PriceHistory.findByPk(req.params.id);
        if (priceHistory) res.json(priceHistory);
        else res.status(404).json({ message: 'Registro de precio no encontrado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener registro de precio', error });
    }
};

exports.create = async (req, res) => {
    try {
        const newPrice = await PriceHistory.create(req.body);
        res.status(201).json(newPrice);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear registro de precio', error });
    }
};

exports.update = async (req, res) => {
    try {
        const [updated] = await PriceHistory.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedPrice = await PriceHistory.findByPk(req.params.id);
            res.json(updatedPrice);
        } else {
            res.status(404).json({ message: 'Registro de precio no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar registro de precio', error });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await PriceHistory.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ message: 'Registro de precio eliminado' });
        } else {
            res.status(404).json({ message: 'Registro de precio no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar registro de precio', error });
    }
};
