const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    razonSocial: { type: String, required: true }, // Nombre o razón social del cliente
    email: { type: String, required: true }, // Email del cliente
    telefono: { type: String }, // Teléfono del cliente
    identificacion: { type: String, required: true, unique: true }, // RUC o cédula del cliente
    direccion: { type: String, required: true }, // Dirección del cliente
    tipoIdentificacion: { type: String, required: true }, // Tipo de identificación (e.g., "05" para cédula)
    contribuyenteRimpe: { type: String }, // Si aplica, régimen RIMPE
    obligadoContabilidad: { type: String, enum: ['SI', 'NO'], default: 'NO' } // Obligado a llevar contabilidad
});

module.exports = mongoose.model('Client', clientSchema);
