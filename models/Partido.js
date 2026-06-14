// modelo de los partidos de fútbol
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partidoSchema = new Schema({
    equipo1: { type: String, required: true },
    equipo2: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
}, { timestamps: true });

const Partido = mongoose.model('Partido', partidoSchema);
module.exports = Partido;