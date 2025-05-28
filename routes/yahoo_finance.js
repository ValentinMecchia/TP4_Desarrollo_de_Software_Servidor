const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/summary/related-symbol/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/summary/related-symbol`,
    params: {
      symbol,
      limit: '5'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
  }
});

router.get('/symbol/quote-type/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/symbol/quote-type`,
    params: {
      symbol
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
  }
});

router.get('/symbol/earning/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/symbol/earning`,
    params: {
      symbol,
      limit: 10
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
  }
});

router.get('/symbol/price-history/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/symbol/price-history`,
    params: {
      symbol,
      from: '806185252',
      to: '1721449367',
      type: 'price_history',
      frequency: '1d',
      limit: '10'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
  }
});

router.get('/news/hot-news', async (req, res) => {
  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/news/hot-news`,
    params: {
      limit: '10'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
  }
});

router.get('/chart/simple-chart/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/chart/simple-chart`,
    params: {
      symbol,
      limit: '10',
      range: '1d'
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la API de Yahoo Finance' });
  }
});

module.exports = router;
