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
// 7. OBTENER JUGADORES DE JAPÓN CON DATOS ESPECÍFICOS (PUNTO 7)
const getJugadoresJapon = (req, res) => {
    // Buscamos el equipo por su nombre "Japan" 
    // El segundo objeto es la PROYECCIÓN: especificamos qué queremos traer del array de jugadores
   equipoModel.findOne(
        { country: "Japan" }, // Filtro para encontrar el equipo de Japón
        {
            "jugadores.shirt_name": 1,
            "jugadores.birth_date": 1,
            "jugadores.pos": 1,
            "jugadores.club": 1,
            _id: 0 // Oculto el ID del equipo para que la respuesta sea más limpia
        }
    )
        .then(response => {
            if (!response) {
                return res.status(404).json({
                    message: 'No se encontró el equipo de Japón en la base de datos.'
                });
            }

            // Retornamos directamente el arreglo de jugadores filtrado
            res.status(200).json({
                message: 'Información de los jugadores de Japón obtenida exitosamente',
                jugadores: response.jugadores
            });
        })
        .catch((error) => res.status(500).json({
            message: 'Error al consultar los jugadores de Japón',
            error: error.message
        }));
};

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
            // Este console.log mostrará en la terminal de VS Code 
            console.error("Error detallado de Mongoose:", error);
            // Respondemos con un código 400 (Bad Request) porque la base de datos lo rechazó
            res.status(400).json({
                message: 'Error al crear el equipo',
                error: error.message
            });
        });
}
// UPDATE EQUIPO
const updateJugador = (req, res) => {
    const idEquipo = Number(req.params.idEquipo); // Recibimos ambos IDs por la URL
    const idJugador = req.params.idJugador;
    const { club, shirt_name } = req.body;       // Recibimos los nuevos datos desde el Body
    
    // 1. Buscamos el equipo que tenga el ID y que ADEMÁS contenga al jugador con el idJugador proporcionado.
    // 2. Usamos el operador '$' para decirle a MongoDB: "Modifica exactamente al jugador que coincidió en la búsqueda".
    equipoModel.findOneAndUpdate(
        { _id: idEquipo, "jugadores._id": idJugador }, // Filtro para encontrar el equipo y el jugador específico
        { $set: { "jugadores.$.club": club, "jugadores.$.shirt_name": shirt_name } }, // Actualización usando el operador $ para modificar solo el jugador específico
        { new: true } // Opción para que la función devuelva el documento actualizado
    )
    .then(response => {
        if (!response) {
            return res.status(404).json({ 
                message: 'No se encontró el equipo o el jugador especificado.' 
            });
        }
        res.status(200).json({ 
            message: 'Datos del jugador actualizados exitosamente ', 
            equipo: response 
        });
    })
    .catch((error) => res.status(400).json({ 
        message: 'Error al actualizar los datos del jugador',
        error: error.message
    }));
    }
// eliminar un jugador sería similar, pero usando $pull en lugar de $set, y sin necesidad de enviar datos en el body, solo los IDs por la URL

// eliminar un equipo completo sería simplemente usando findByIdAndDelete con el ID del equipo

//eliminar all equipos 
// sería usando deleteMany({}) sin ningún filtro
const deleteAllEquipos = (req, res) => {
    equipoModel.deleteMany({}) // se ejecuta y devuelve una promesa con un objeto que tiene la propiedad 
                            //    deletedCount, que indica cuántos documentos fueron eliminados
        .then(response => {
            res.json({ message: 'Todos los equipos han sido eliminados', deletedCount: response.deletedCount });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error al eliminar todos los equipos', error: error.message });
        });
};

// 8. OBTENER JUGADORES CON ESTATURA INFERIOR A 170 (PUNTO 8)
const getJugadoresBajitos = (req, res) => {
    equipoModel.aggregate([
        // 1. Separamos el array de jugadores para que cada jugador sea un documento independiente
        { $unwind: "$jugadores" },
        // 2. Filtramos los jugadores cuya estatura sea estrictamente menor (<) a 170
        { $match: { "jugadores.height": { $lt: 170 } } },
        // 3. Proyectamos o moldeamos la salida para que solo muestre los datos del jugador
        {
            $project: {
                _id: 0,
                country: "$country", // Nos ayuda a saber de qué país es
                nombre: "$jugadores.shirt_name",
                estatura: "$jugadores.height",
                posicion: "$jugadores.pos",
                club: "$jugadores.club"
            }
        }
    ])
    .then(response => {
        if (response.length === 0) {
            return res.status(404).json({ 
                message: 'No se encontraron jugadores con estatura inferior a 170 cm.' 
            });
        }
        res.status(200).json({
            message: 'Listado de jugadores con estatura inferior a 170 cm obtenido con éxito',
            cantidad: response.length,
            jugadores: response
        });
    })
    .catch((error) => res.status(500).json({ 
        message: 'Error al realizar la agregación de estatura',
        error: error.message
    }));
};
// 10. OBTENER EL O LOS JUGADORES MÁS ALTOS DEL MUNDIAL (PUNTO 10)
// se usa tipo pipeline de agregación porque necesitamos hacer varios pasos 
// de procesamiento de datos para obtener el resultado correcto
const getJugadoresMasAltos = (req, res) => {
    equipoModel.aggregate([
        // 1. Desarmamos el array de jugadores para tratarlos de forma individual
        { $unwind: "$jugadores" },
        
        // 2. Ordenamos a TODOS los jugadores por estatura de mayor a menor (-1)
        { $sort: { "jugadores.height": -1 } },
        
        // 3. Agrupamos para encontrar el valor máximo actual en toda la base de datos
        // y guardamos la lista completa de jugadores para no perder sus datos
        {
            $group: {
                _id: null,
                maxEstatura: { $first: "$jugadores.height" }, // El primero de la lista ordenada es el más alto
                todosLosJugadores: { 
                    $push: {
                        country: "$country",
                        nombre: "$jugadores.shirt_name",
                        estatura: "$jugadores.height",
                        posicion: "$jugadores.pos",
                        club: "$jugadores.club"
                    } 
                }
            }
        },
        
        // 4. Filtramos la lista completa para quedarnos ÚNICAMENTE con los que empaten con la estatura máxima
        {
            $project: {
                _id: 0,
                estaturaMaxima: "$maxEstatura",
                jugadoresMasAltos: {
                    $filter: {
                        input: "$todosLosJugadores",
                        as: "jugador",
                        cond: { $eq: ["$$jugador.estatura", "$maxEstatura"] }
                    }
                }
            }
        }
    ])
    .then(response => {
        if (response.length === 0 || response[0].jugadoresMasAltos.length === 0) {
            return res.status(404).json({ 
                message: 'No se encontraron jugadores en la base de datos.' 
            });
        }
        
        // Como agrupamos con _id: null, mongo devuelve un array con un único objeto en la posición 0
        res.status(200).json({
            message: 'El o los jugadores más altos del mundial fueron obtenidos con éxito',
            estaturaMaximaCm: response[0].estaturaMaxima,
            jugadores: response[0].jugadoresMasAltos
        });
    })
    .catch((error) => res.status(500).json({ 
        message: 'Error al calcular el jugador más alto',
        error: error.message
    }));
};


module.exports = {
    getAllEquipos,
    createNewEquipo,
    updateJugador,
    deleteAllEquipos,
    getJugadoresJapon,
    getJugadoresBajitos,
    getJugadoresMasAltos
}

