const express = require('express');
const axios = require('axios');
const router = express.Router();

// Market Endpoints
router.get('/market/tickers', async (req, res) => {
    const options = {
        method: 'GET',
        url: `https://${process.env.RAPIDAPI_HOST}/api/v2/markets/tickers`,
        params: { region: 'US', limit: '10', type: 'STOCKS' },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
    }
});

router.get('/search/:query', async (req, res) => {
    const query = req.params.query;

    const options = {
        method: 'GET',
        url: `https://${process.env.RAPIDAPI_HOST}/api/v1/markets/search`,
        params: { search: query, limit: '10' },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        // Log para depuración
        console.log("Respuesta de /search/:query", JSON.stringify(response.data, null, 2));
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
    }
});

router.get('/market/quotes/realtime/:symbol', async (req, res) => {
    const symbol = req.params.symbol;

    const options = {
        method: 'GET',
        url: `https://${process.env.RAPIDAPI_HOST}/api/v1/markets/quote`,
        params: { ticker: symbol, type: 'STOCKS' },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
    }
});

router.get('/market/quotes/history/:symbol', async (req, res) => {
    const symbol = req.params.symbol;

    const options = {
        method: 'GET',
        url: `https://${process.env.RAPIDAPI_HOST}/api/v2/markets/stock/history`,
        params: { symbol, period: '1d', interval: '1m' },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
    }
});

module.exports = router;