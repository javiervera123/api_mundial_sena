// controllers/PartidoController.js
// Importo mi modelo de partidos
const partidoModel = require('../models/Partido');

// 1. REGISTRAR PARTIDO (PUNTO 4 DEL TALLER)
const createNewPartido = (req, res, next) => {
    console.log("¡Llegó la petición a la función createNewPartido!");
    console.log("Datos recibidos en el body:", req.body);
    const partido = new partidoModel({
        equipo1: req.body.equipo1,
        equipo2: req.body.equipo2,
        date: req.body.date,
        time: req.body.time
    });

    partido.save()
        .then(response => {
            res.status(201).json({
                message: 'Partido creado exitosamente',
                partido: response
            });
        })
        .catch((error) => {
            console.error("Error detallado de Mongoose:", error); // Esto sale en VS Code
            res.status(400).json({ // ¡Esto le responde a Postman para que no se cuelgue!
                message: 'Error al crear el partido',
                error: error.message
            });
        });
};

// 2. CONSULTAR TODOS (PUNTO 8 DEL TALLER)
const queryPartido = (req, res, next) => {
    partidoModel.find()
        .then(response => {
            res.status(200).json(response);
        })
        .catch((error) => res.status(500).json({
            message: 'Error al obtener los partidos'
        }));
};

// 3. CONSULTAR POR ID (Mapeo por ID hexadecimal nativo de Mongo)
const queryPartidoById = (req, res, next) => {
    let idPartido = req.body.idPartido;

    partidoModel.findById(idPartido)
        .then(response => {
            if (!response) {
                return res.status(404).json({ message: 'Partido no encontrado' });
            }
            res.status(200).json(response);
        })
        .catch((error) => res.status(400).json({
            message: 'Error al obtener el partido con código: ' + idPartido
        }));
};

// 4. ACTUALIZAR TODO EL PARTIDO POR ID
const updatePartidoById = (req, res) => {
    let idPartido = req.body.idPartido;

    // Se pasa el id y el objeto con los datos nuevos que vienen de Postman
    partidoModel.findByIdAndUpdate(idPartido, req.body, { new: true })
        .then(response => {
            if (!response) {
                return res.status(404).json({ message: 'Partido no encontrado para actualizar' });
            }
            res.status(200).json({ message: 'Partido actualizado completamente', partido: response });
        })
        .catch((error) => res.status(400).json({
            message: 'Error al actualizar el partido con código: ' + idPartido
        }));
};

// 5. ACTUALIZAR SÓLO LA HORA DE UN PARTIDO (PUNTO 5 DEL TALLER)
const updatePartidoTime = (req, res) => {
    let idPartido = req.body.idPartido;
    let newTime = req.body.time;

    // Optimizado: Usamos findByIdAndUpdate para apuntar directamente al id enviado
    partidoModel.findByIdAndUpdate(idPartido, { time: newTime }, { new: true })
        .then(response => {
            if (!response) {
                return res.status(404).json({ message: 'Partido no encontrado para actualizar la hora' });
            }
            res.status(200).json({
                message: 'Hora del partido actualizada exitosamente',
                partido: response
            });
        })
        .catch((error) => res.status(400).json({
            message: 'Error al actualizar la hora del partido con código: ' + idPartido
        }));
};

// 6. ELIMINAR POR ID (PUNTO 6 DEL TALLER)
const deletePartidoById = (req, res) => {
    let idPartido = req.body.idPartido;

    //  findByIdAndDelete es más rápido y directo si uso el ID físico
    partidoModel.findByIdAndDelete(idPartido)
        .then(response => {
            if (!response) {
                return res.status(404).json({ message: 'Partido no encontrado para eliminar' });
            }
            res.status(200).json({ message: 'Partido eliminado exitosamente' });
        })
        .catch((error) => res.status(400).json({
            message: 'Error al eliminar el partido con código: ' + idPartido
        }));
};

//  ELIMINAR TODOS
const deleteAllPartidos = (req, res) => {
    partidoModel.deleteMany()
        .then(response => {
            res.status(200).json({ message: 'Todos los partidos eliminados exitosamente' });
        })
        .catch((error) => res.status(400).json({
            message: 'Error al eliminar todos los partidos',
            error: error.message
        }));
};

// Exportación limpia de las funciones del controlador
module.exports = {
    createNewPartido,
    queryPartido,
    queryPartidoById,
    updatePartidoById,
    deletePartidoById,
    deleteAllPartidos,
    updatePartidoTime
};