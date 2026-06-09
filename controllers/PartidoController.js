// importo mi modelo de partidos
const partidoModel = require('../models/Partido');
// accions CRUD
// new partido OK
const createNewPartido = (req, res, next) => {
    const partido = new partidoModel({
        "equipo1": req.body.equipo1,
        "equipo2": req.body.equipo2,
        "date": req.body.date,
        "time": req.body.time
    });
    partido.save()
        .then(response => {
            res.status(201).json(
                { message: 'Partido creado exitosamente', partido: response }
            );
        })
        .catch((error) => {
            // Este console.log se mostrará en la terminal de VS Code 
            console.error("Error detallado de Mongoose:", error);
        })
        .catch((error) => {
            // Respondemos con un código 400 (Bad Request) porque la base de datos lo rechazó   
            res.status(400).json({
                message: 'Error al crear el partido',
                error: error.message
            });
        });
}
// consultar todos OK
const queryPartido = (req, res, next) => {
    partidoModel.find()
        .then(response => {
            res.json(response)
        })
        .catch((error) => res.status(500).json(
            { message: 'Error al obtener los partidos' }));
}

// consultar por id
const queryPartidoById = (req, res, next) => {
    let idPartido = req.body.idPartido;
    partido.model.findById(idPartido)
        .then(response => {
            if (!response) {
                return res.status(404).json(
                    { message: 'Partido no encontrado' });
            }
            res.json(response);
        })
        .catch((error) => res.status(400).json(
            { message: 'Error al obtener el partido con código: ' + idPartido }));
        }
    // actualizar por id OK
    const updatePartidoById = (req, res, next) => {
        let idPartido = req.body.idPartido;
        partidoModel.findByIdAndUpdate(idPartido)
            .then(response => {
                if (!response) {
                    return res.status(404).json(
                        { message: 'Partido no encontrado' });
                }
                res.json(response);
            })
            .catch((error) => res.status(400).json(
                { message: 'Error al actualizar el partido con código: ' + idPartido }));
    }

    // eliminar por id OK
    const deletePartidoById = (req, res, next) => {
        let idPartido = req.body.idPartido;
        partidoModel.findByIdAndDelete(idPartido)
            .then(response => {
                if (!response) {
                    return res.status(404).json(
                        { message: 'Partido no encontrado para eliminar' });
                }
                res.json({ message: 'Partido eliminado exitosamente' });
            })
            .catch((error) => res.status(400).json(
                { message: 'Error al eliminar el partido con código: ' + idPartido }));
    }

    // eliminar todos. OK
    const deleteAllPartidos = (req, res, next) => {
        partidoModel.deleteMany()
            .then(response => {
                res.json({ message: 'Todos los partidos eliminados exitosamente' });
            })
            .catch((error) => res.status(400).json(
                { message: 'Error al eliminar todos los partidos', error: error.message }));
    }
    module.exports = {
        createNewPartido,
        queryPartido,
        queryPartidoById,
        updatePartidoById,
        deletePartidoById,
        deleteAllPartidos
    };
