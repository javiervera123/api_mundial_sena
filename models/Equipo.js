// models/equipos.js
const mongoose = require('mongoose');
// def del modelo de losjugadores
const Schema = mongoose.Schema;
const jugadorSchema = new Schema({
    num: { type: Number, required: true },
    pos: { type: String, required: true },
    fifa_name: { type: String, required: true },
    birth_date: { type: String, required: true },
    shirt_name: { type: String, required: true },
    club: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true }
}, { timestamps: true });

// def del modelo de los equipos
const equipoSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    abbreviation: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    confederation: {
        type: String,
        required: true
    },
    jugadores: [jugadorSchema] // Un equipo tiene un array de jugadores, por seguridad
}, { timestamps: true });  // timestamps: true agrega automáticamente campos createdAt y updatedAt, cuado se crea , es un log

const Equipo = mongoose.model('Equipo', equipoSchema);
module.exports = Equipo;