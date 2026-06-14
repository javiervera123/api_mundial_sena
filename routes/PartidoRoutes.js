// rutas de los partidos
const partidoController = require('../controllers/PartidoController');
const express = require('express');
const router = express.Router();

router.get('/', partidoController.queryPartido);
router.get('/:id', partidoController.queryPartidoById);
router.post('/guardar', partidoController.createNewPartido);
router.put('/partidos/:id', partidoController.updatePartidoById);
router.patch('/actualizar-hora', partidoController.updatePartidoTime);
router.delete('/eliminar', partidoController.deletePartidoById);
router.delete('/eliminarAll', partidoController.deleteAllPartidos);
        
       

module.exports = router; // exporto el router para que pueda ser usado en server.js