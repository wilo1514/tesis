const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Esquema del emisor
const EmisorSchema = new Schema({
    ruc: String,
    razonSocial: String,
    nombreComercial: String,
    direccionMatriz: String,
    direccionEstablecimiento: String,
    contribuyenteEspecial: String,
    obligadoContabilidad: String
});

// Esquema de los impuestos
const ImpuestoSchema = new Schema({
    codigo: String,
    codigoPorcentaje: String,
    baseImponible: Number,
    valor: Number
});

// Esquema de los detalles de la factura
const DetalleFacturaSchema = new Schema({
    codigoPrincipal: String,
    descripcion: String,
    precioTotalSinImpuesto: Number,
    impuestos: [ImpuestoSchema],
});

// Esquema principal de la factura
const FacturaSchema = new Schema({
    numeroAutorizacion: String,
    fechaEmision: String,
    numeroComprobante: String,
    periodoFiscal: String,
    totalSinImpuestos: Number,
    totalConImpuestos: [ImpuestoSchema],
    importeTotal: Number,
    moneda: String,
    emisor: EmisorSchema,
    detalles: [DetalleFacturaSchema],
    informacionAdicional: [{
        nombre: String,
        valor: String
    }]
});

module.exports = mongoose.model('Factura', FacturaSchema);
