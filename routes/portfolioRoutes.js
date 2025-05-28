const express = require('express');
const router = express.Router();
const portafolioController = require('../controllers/portafolioController');

router.get('/', portafolioController.getAll);
router.get('/:id', portafolioController.getById);
router.post('/', portafolioController.create);
router.put('/:id', portafolioController.update);
router.delete('/:id', portafolioController.remove);

module.exports = router;