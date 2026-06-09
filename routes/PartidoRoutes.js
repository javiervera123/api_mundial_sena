// rutas de los partidos
const partidoController = require('../controllers/PartidoController');
const express = require('express');
const router = express.Router();

router.get('/', partidoController.queryPartido);
router.get('/:id', partidoController.queryPartidoById);
router.post('/guardar', partidoController.createNewPartido);
router.put('/partidos/:id', partidoController.updatePartidoById);
router.delete('/partidos/:id', partidoController.deletePartidoById);
router.delete('/partidos', partidoController.deleteAllPartidos);
        
       

module.exports = router; // exporto el router para que pueda ser usado en server.js