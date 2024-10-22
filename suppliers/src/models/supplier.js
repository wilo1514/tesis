const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    razonSocial: { type: String, required: true }, // Nombre o razón social del cliente
    email: { type: String, required: true }, // Email del cliente
    telefono: { type: String }, // Teléfono del cliente
    identificacion: { type: String, required: true}, // RUC o cédula del cliente unique: true
    direccion: { type: String, required: true }, // Dirección del cliente
    tipoIdentificacion: { type: String, required: true }, // Tipo de identificación (e.g., "05" para cédula)
    regimen: { type: String, required: true }, // Régimen tributario del proveedor
    obligadoContabilidad: { type: String, enum: ['SI', 'NO'], default: 'NO' } // Obligado a llevar contabilidad
});

module.exports = mongoose.model('Supplier', supplierSchema);
