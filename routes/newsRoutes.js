const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Obtener todas las noticias favoritas del usuario autenticado
router.get('/', newsController.getAll);
// Guardar noticia favorita
router.post('/', newsController.create);
// Actualizar nota/descripción de noticia favorita
router.put('/:id', newsController.update);
// Eliminar noticia favorita
router.delete('/:id', newsController.remove);
// Obtener noticia favorita por id
router.get('/:id', newsController.getById);

module.exports = router;
