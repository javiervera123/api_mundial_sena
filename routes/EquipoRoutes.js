const equipoController = require('../controllers/EquipoController');
const express = require('express');
const router = express.Router();

router.get('/', equipoController.getAllEquipos);
router.get('/:id', equipoController.getEquipoById);
router.post('/guardar', equipoController.createNewEquipo);
//router.put('/equipos/:id', equipoController.updateEquipo);
//router.delete('/equipos/:id', equipoController.deleteEquipo);

module.exports = router; // exporto el router para que pueda ser usado en server.js