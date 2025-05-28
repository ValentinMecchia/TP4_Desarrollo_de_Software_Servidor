const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assetsController');

router.get('/', assetsController.getAll);
router.get('/:id', assetsController.getById);
router.post('/', assetsController.create);
router.put('/:id', assetsController.update);
router.delete('/:id', assetsController.remove);

module.exports = router;