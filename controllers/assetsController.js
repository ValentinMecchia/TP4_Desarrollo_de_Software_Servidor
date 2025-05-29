const { body, validationResult } = require('express-validator');
const Asset = require('../models/Asset');

const validateAsset = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser un texto'),
    body('ticker')
        .notEmpty().withMessage('El ticker es obligatorio')
        .isString().withMessage('El ticker debe ser un texto'),
    body('type')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isIn(['stock', 'bond', 'crypto']).withMessage('Tipo inválido, debe ser stock, bond o crypto'),
    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),
    
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
        const assets = await Asset.findAll();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los assets' });
    }
};

exports.getById = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (asset) {
            res.json(asset);
        } else {
            res.status(404).json({ error: 'Asset no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el asset' });
    }
};

exports.create = [
    ...validateAsset,
    async (req, res) => {
        try {
            const newAsset = await Asset.create(req.body);
            res.status(201).json(newAsset);
        } catch (error) {
            res.status(400).json({ error: 'Error al crear el asset' });
        }
    }
];

exports.update = [
    ...validateAsset,
    async (req, res) => {
        try {
            const [updated] = await Asset.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedAsset = await Asset.findByPk(req.params.id);
                res.json(updatedAsset);
            } else {
                res.status(404).json({ error: 'Asset no encontrado' });
            }
        } catch (error) {
            res.status(400).json({ error: 'Error al actualizar el asset' });
        }
    }
];

exports.remove = async (req, res) => {
    try {
        const deleted = await Asset.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ message: 'Asset eliminado' });
        } else {
            res.status(404).json({ error: 'Asset no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el asset' });
    }
};
