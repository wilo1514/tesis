const mongoose = require('mongoose');

const FacturaPendienteSchema = new mongoose.Schema({
    facturaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Factura', required: true },
    xmlFirmado: { type: String, required: true },
    reintentos: { type: Number, default: 0 },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FacturaPendiente', FacturaPendienteSchema);
