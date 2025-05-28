const { New } = require('../models/New');

exports.getById = async (req, res) => {
    try {
        const new_ = await New.findByPk(req.params.id);
        if (new_) res.json(new_);
        else res.status(404).json({ message: 'Inversión no encontrada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener inversión', error });
    }
};