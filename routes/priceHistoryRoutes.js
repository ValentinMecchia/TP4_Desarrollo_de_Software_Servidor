const express = require('express');
const router = express.Router();
const priceHistoryController = require('../controllers/priceHistoryController');

router.get('/:id', priceHistoryController.getById);
router.post('/', priceHistoryController.create);

module.exports = router;
