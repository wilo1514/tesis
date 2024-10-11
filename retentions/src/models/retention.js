const mongoose = require('mongoose');

const ImpuestoSchema = new mongoose.Schema({
    codigo: String,
    codigoPorcentaje: String,
    tarifa: Number,
    baseImponible: Number,
    valor: Number
});

const DetalleSchema = new mongoose.Schema({
    codigoPrincipal: String,
    descripcion: String,
    cantidad: Number,
    precioUnitario: Number,
    descuento: Number,
    precioTotalSinImpuesto: Number,
    impuestos: [ImpuestoSchema]
});

const PagoSchema = new mongoose.Schema({
    formaPago: String,
    total: Number,
    plazo: String,
    unidadTiempo: String
});

const InformacionAdicionalSchema = new mongoose.Schema({
    nombre: String,
    valor: String
});

const FacturaSchema = new mongoose.Schema({
    claveAcceso: { type: String, required: true, unique: true },
    amb: String,
    tipoEmision: String,
    estab: String,
    ptoEmi: String,
    secuencial: String,
    emisor: {
        ruc: String,
        razonSocial: String,
        nombreComercial: String,
        direccionMatriz: String,
        direccionEstablecimiento: String,
        contribuyenteEspecial: String,
        obligadoContabilidad: String
    },
    receptor: {
        identificacion: String,
        tipoIdentificacion: String,
        razonSocial: String,
        direccion: String,
        telefono: String,
        email: String
    },
    fechaEmision: { type: String, required: true },
    detalles: [DetalleSchema],
    informacionAdicional: [InformacionAdicionalSchema],
    totalSinImpuestos: Number,
    totalDescuento: Number,
    propina: Number,
    importeTotal: Number,
    moneda: { type: String, default: 'USD' },
    pagos: [PagoSchema],
    firma: { type: String }
});

module.exports = mongoose.model('Factura', FacturaSchema);
