const Portfolio = require('../models/Portfolio');

exports.getAll = async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll();
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los portafolios' });
  }
};

exports.getById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByPk(req.params.id);
    if (portfolio) {
      res.json(portfolio);
    } else {
      res.status(404).json({ error: 'Portafolio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el portafolio' });
  }
};

exports.create = async (req, res) => {
  try {
    const newPortfolio = await Portfolio.create(req.body);
    res.status(201).json(newPortfolio);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el portafolio' });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Portfolio.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPortfolio = await Portfolio.findByPk(req.params.id);
      res.json(updatedPortfolio);
    } else {
      res.status(404).json({ error: 'Portafolio no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el portafolio' });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Portfolio.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Portafolio eliminado' });
    } else {
      res.status(404).json({ error: 'Portafolio no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el portafolio' });
  }
};