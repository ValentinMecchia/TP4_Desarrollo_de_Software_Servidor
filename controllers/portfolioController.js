const Portfolio = require('../models/Portfolio');
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
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser una cadena de texto'),
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
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
    body('name')
        .optional()
        .notEmpty().withMessage('El nombre no puede estar vacío')
        .isString().withMessage('El nombre debe ser una cadena de texto'),
    body('description')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
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
    const portfolios = await Portfolio.findAll();
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los portafolios' });
  }
};

exports.getById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (portfolio) {
      res.json(portfolio);
    } else {
      res.status(404).json({ error: 'Portafolio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el portafolio' });
  }
};

exports.create = async (req, res) => {
  try {
    const newPortfolio = await Portfolio.create(req.body);
    res.status(201).json(newPortfolio);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el portafolio' });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Portfolio.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPortfolio = await Portfolio.findByPk(req.params.id);
      res.json(updatedPortfolio);
    } else {
      res.status(404).json({ error: 'Portafolio no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el portafolio' });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Portfolio.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Portafolio eliminado' });
    } else {
      res.status(404).json({ error: 'Portafolio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el portafolio' });
  }
};
