const express = require('express');
const router = express.Router();
const priceHistory = require('../controllers/priceHistory');

router.get('/:id', priceHistory.getById);
router.post('/', priceHistory.create);

module.exports = router;
