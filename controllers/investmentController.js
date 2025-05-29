const { body, validationResult } = require('express-validator');
const { Investment } = require('../models/Investment');

const validateInvestment = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser texto'),
    body('amount')
        .notEmpty().withMessage('El monto es obligatorio')
        .isFloat({ gt: 0 }).withMessage('El monto debe ser un número mayor a 0'),
    body('date')
        .notEmpty().withMessage('La fecha es obligatoria')
        .isISO8601().withMessage('La fecha debe tener formato válido'),
    body('type')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isIn(['stock', 'bond', 'crypto']).withMessage('Tipo inválido'),
    
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
        const investments = await Investment.findAll();
        res.json(investments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener inversiones', error });
    }
};

exports.getById = async (req, res) => {
    try {
        const investment = await Investment.findByPk(req.params.id);
        if (investment) res.json(investment);
        else res.status(404).json({ message: 'Inversión no encontrada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener inversión', error });
    }
};

exports.create = [
    ...validateInvestment,
    async (req, res) => {
        try {
            const newInvestment = await Investment.create(req.body);
            res.status(201).json(newInvestment);
        } catch (error) {
            res.status(400).json({ message: 'Error al crear inversión', error });
        }
    }
];

exports.update = [
    ...validateInvestment,
    async (req, res) => {
        try {
            const updated = await Investment.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated[0] > 0) res.json({ message: 'Inversión actualizada' });
            else res.status(404).json({ message: 'Inversión no encontrada' });
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar inversión', error });
        }
    }
];

exports.remove = async (req, res) => {
    try {
        const deleted = await Investment.destroy({ where: { id: req.params.id } });
        if (deleted) res.json({ message: 'Inversión eliminada' });
        else res.status(404).json({ message: 'Inversión no encontrada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar inversión', error });
    }
};
