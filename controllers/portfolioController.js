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
    // Solo devuelve los portafolios del usuario autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const portfolios = await Portfolio.findAll({ where: { userId: req.user.id } });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los portafolios' });
  }
};

exports.getById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portafolio no encontrado' });
    }
    // Solo permite ver si es del usuario autenticado
    if (!req.user || !req.user.id || portfolio.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    res.json({ portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el portafolio' });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    const newPortfolio = await Portfolio.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({ portfolio: newPortfolio });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el portafolio' });
  }
};

exports.update = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portafolio no encontrado' });
    }
    if (!req.user || !req.user.id || portfolio.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    await portfolio.update({
      name: req.body.name ?? portfolio.name,
      description: req.body.description ?? portfolio.description,
    });
    res.json(portfolio);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el portafolio' });
  }
};

exports.remove = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portafolio no encontrado' });
    }
    if (!req.user || !req.user.id || portfolio.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    await portfolio.destroy();
    res.json({ message: 'Portafolio eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el portafolio' });
  }
};

// Agregar asset a un portafolio
exports.addAssetToPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portafolio no encontrado' });
    }
    if (!req.user || !req.user.id || portfolio.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    // Asegura que assets sea un array
    let assets = Array.isArray(portfolio.assets) ? [...portfolio.assets] : [];
    // Normaliza el asset recibido
    const asset = {
      name: req.body.name || req.body.shortname || req.body.symbol || "",
      symbol: req.body.symbol,
      quantity: Number(req.body.quantity ?? req.body.amount ?? 1),
      price: Number(req.body.price ?? req.body.pricePerUnit ?? 0),
      // Puedes agregar más campos si lo deseas
    };
    // Evita duplicados por symbol, reemplaza si ya existe
    const idx = assets.findIndex(a => a.symbol === asset.symbol);
    if (idx !== -1) {
      assets[idx] = asset;
    } else {
      assets.push(asset);
    }
    await portfolio.update({ assets });
    res.json({ ok: true, asset, assets });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar asset al portafolio' });
  }
};

// Eliminar asset de un portafolio por symbol
exports.removeAssetFromPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portafolio no encontrado' });
    }
    if (!req.user || !req.user.id || portfolio.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    let assets = Array.isArray(portfolio.assets) ? [...portfolio.assets] : [];
    const symbol = req.params.symbol || req.body.symbol;
    if (!symbol) return res.status(400).json({ error: 'Símbolo requerido' });
    // Filtra por symbol, asegurando que solo se elimina el asset correcto
    const filtered = assets.filter(a => a.symbol !== symbol);
    await portfolio.update({ assets: filtered });
    res.json({ ok: true, assets: filtered });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar asset del portafolio' });
  }
};
