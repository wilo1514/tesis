const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImpuestoSchema = new Schema({
    codigo: String,
    codigoPorcentaje: String,
    tarifa: Number,
    baseImponible: Number,
    valor: Number
});

const productSchema = new Schema({
    codigoPrincipal: String,
    descripcion: String,
    precioUnitario: Number,
    precioTotalSinImpuesto: Number,
    impuestos: [ImpuestoSchema]
});

module.exports = mongoose.model('Product', productSchema);
