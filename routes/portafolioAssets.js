// routes/portfolioAssets.js
const express = require('express');
const router = express.Router();
const portfolioAssetsController = require('../controllers/portfolioAssetsController');

// POST /api/portfolios/:portfolioId/assets
router.post('/:portfolioId/assets', portfolioAssetsController.addAsset);

module.exports = router;
