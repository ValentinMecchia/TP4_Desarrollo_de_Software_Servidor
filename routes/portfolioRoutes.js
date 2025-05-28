const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/', portfolioController.getAll);
router.get('/:id', portfolioController.getById);
router.post('/', portfolioController.create);
router.put('/:id', portfolioController.update);
router.delete('/:id', portfolioController.remove);

module.exports = router;