
const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/EquipoController');

router.get('/', equipoController.getAllEquipos);
router.get('/jugadores-japon', equipoController.getJugadoresJapon);
router.get('/jugadores-mas-altos', equipoController.getJugadoresMasAltos);
router.post('/guardar', equipoController.createNewEquipo);
router.get('/jugadores-bajitos', equipoController.getJugadoresBajitos);
router.delete('/eliminar', equipoController.deleteAllEquipos);
router.put('/:idEquipo/jugadores/:idJugador', equipoController.updateJugador);
//router.put('/equipos/:id', equipoController.updateEquipo);
//router.delete('/equipos/:id', equipoController.deleteEquipo);

module.exports = router; // exporto el router para que pueda ser usado en server.js