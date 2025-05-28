const { PriceHistory } = require('../models/PriceHistory');

exports.getById = async (req, res) => {
    try {
        const priceHistory = await PriceHistory.findByPk(req.params.id);
        if (priceHistory) res.json(priceHistory);
        else res.status(404).json({ message: 'Inversión no encontrada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener inversión', error });
    }
};

exports.create = async (req, res) => {
    try {
        const newPrice = await PriceHistory.create(req.body);
        res.status(201).json(newPrice);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear inversión', error });
    }
};