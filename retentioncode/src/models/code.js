const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const codeSchema = new Schema({
    type: String,
    descripcion: String,
    codigo: Number,
    porcentaje: Number
});

module.exports = mongoose.model('Code', codeSchema);
