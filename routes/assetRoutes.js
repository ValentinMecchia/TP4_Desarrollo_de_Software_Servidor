const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assetsController');

// FAVORITES endpoints (deben ir antes de las rutas con :id)
router.get('/favorites', assetsController.getFavorites);
router.post('/favorites', assetsController.addFavorite);
router.put('/favorites/:id', assetsController.updateFavorite);
router.delete('/favorites/:id', assetsController.removeFavorite);

// Rutas de assets
router.get('/', assetsController.getAll);
router.post('/', assetsController.create);
router.get('/:id', assetsController.getById);
router.put('/:id', assetsController.update);
router.delete('/:id', assetsController.remove);

module.exports = router;