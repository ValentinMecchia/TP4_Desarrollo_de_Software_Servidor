const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/:id', priceHistory.getById);

module.exports = router;
