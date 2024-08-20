const mongoose = require('mongoose');

const FacturaSchema = new mongoose.Schema({
    claveAcceso: { type: String, required: true, unique: true },
    emisor: {
        ruc: String,
        razonSocial: String,
        direccionMatriz: String,
        direccionEstablecimiento: String,
        contribuyenteEspecial: String,
        obligadoContabilidad: String
    },
    receptor: {
        identificacion: String,
        razonSocial: String,
        direccion: String,
        email: String
    },
    fechaEmision: { type: Date, default: Date.now },
    detalles: [
        {
            codigoPrincipal: String,
            descripcion: String,
            cantidad: Number,
            precioUnitario: Number,
            descuento: Number,
            precioTotalSinImpuesto: Number,
            impuestos: [
                {
                    codigo: String,
                    codigoPorcentaje: String,
                    tarifa: Number,
                    baseImponible: Number,
                    valor: Number
                }
            ]
        }
    ],
    informacionAdicional: [
        {
            nombre: String,
            valor: String
        }
    ],
    totalSinImpuestos: Number,
    totalDescuento: Number,
    propina: Number,
    importeTotal: Number,
    moneda: { type: String, default: 'USD' },
    pagos: [
        {
            formaPago: String,
            total: Number
        }
    ]
});

module.exports = mongoose.model('Factura', FacturaSchema);
