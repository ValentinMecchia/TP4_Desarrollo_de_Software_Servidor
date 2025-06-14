const { body, validationResult } = require('express-validator');
const { Asset, FavoriteAsset } = require('../models/Asset'); // <-- Importar ambos modelos correctamente
const { Op } = require('sequelize');

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

// Obtener favoritos del usuario autenticado
exports.getFavorites = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const favs = await FavoriteAsset.findAll({ where: { userId: req.user.id } });
    res.json(favs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener favoritos', error });
  }
};

// Agregar favorito
exports.addFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    // Evita duplicados por symbol para el usuario
    const exists = await FavoriteAsset.findOne({ where: { symbol: req.body.symbol, userId: req.user.id } });
    if (exists) return res.status(200).json(exists);

    const fav = await FavoriteAsset.create({
      userId: req.user.id,
      symbol: req.body.symbol,
      name: req.body.name || "",
      comment: req.body.comment || "",
    });
    res.status(201).json(fav);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar favorito', error });
  }
};

// Actualizar comentario de favorito
exports.updateFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const fav = await FavoriteAsset.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!fav) return res.status(404).json({ message: 'Favorito no encontrado' });
    if (req.body.comment !== undefined) fav.comment = req.body.comment;
    await fav.save();
    res.json(fav);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar favorito', error });
  }
};

// Eliminar favorito
exports.removeFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const deleted = await FavoriteAsset.destroy({ where: { id: req.params.id, userId: req.user.id } });
    if (deleted) {
      res.json({ message: 'Favorito eliminado' });
    } else {
      res.status(404).json({ message: 'Favorito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar favorito', error });
  }
};
