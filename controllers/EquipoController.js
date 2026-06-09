// controllers/EquipoController.js
// importo el modelo de equipo declarando la ruta del archivo
const equipoModel = require('../models/Equipo');
// accions CRUD
// GET ALL EQUIPOS
const getAllEquipos = (req, res, next) => {
    equipoModel.find()  // equivalente al find de MongoDB, pero con Mongoose, devuelve una promesa
        .then(response => {
            res.json(response)
        })
        .catch((error) => res.status(500).json(
            { message: 'Error al obtener los equipos' }));
}
// GET EQUIPO BY ID
const getEquipoById = (req, res, next) => {
    let idEquipo = req.body.idEquipo; // req.body.idEquipo es el id que me envía el cliente en el cuerpo de la petición
    equipoModel.findById(idEquipo)
        .then(response => {
            if (!response) {
                return res.status(404).json(
                    { message: 'Equipo no encontrado' });
            }
            res.json(response);
        })
        .catch((error) => res.status(400).json(
            { message: 'Error al obtener el equipocon codigo: ' + idEquipo }));
}
// CREATE NEW EQUIPO
const createNewEquipo = (req, res, next) => {
    const equipo = new equipoModel({
        _id: req.body._id,
        abbreviation: req.body.abbreviation,
        country: req.body.country,
        confederation: req.body.confederation,
        jugadores: req.body.jugadores || [] // Si no se envía un array de jugadores, se asigna un array vacío por defecto
    });
    equipo.save()
        .then(response => {
            res.status(201).json(
                { message: 'Equipo creado exitosamente', equipo: response }
            );
        })
        .catch((error) => {
            // IMPORTANTE: Este console.log te mostrará en la terminal de VS Code 
            // el motivo exacto si llega a fallar por otra validación.
            console.error("Error detallado de Mongoose:", error);

            // Respondemos con un código 400 (Bad Request) porque la base de datos lo rechazó
            res.status(400).json({
                message: 'Error al crear el equipo',
                error: error.message
            });
        });
}

module.exports = {
    getAllEquipos,
    getEquipoById,
    createNewEquipo
}
// UPDATE EQUIPO
