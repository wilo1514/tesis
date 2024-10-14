const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Impuesto retenido
const ImpuestoRetenidoSchema = new Schema({
    codigo: String, // Código del impuesto (1 para IVA, por ejemplo)
    codigoPorcentaje: String, // Código del porcentaje retenido
    baseImponible: Number, // Base imponible del impuesto retenido
    valorRetenido: Number, // Valor del impuesto retenido
    codDocSustento: String, // Código del documento sustento
    numDocSustento: String, // Número del documento sustento
    fechaEmisionDocSustento: String // Fecha de emisión del documento sustento
});

// Comprobante afectado
const ComprobanteAfectadoSchema = new Schema({
    tipoComprobante: String, // Tipo de comprobante (01 para factura, por ejemplo)
    numeroComprobante: String, // Número del comprobante afectado
    fechaEmisionComprobante: String // Fecha de emisión del comprobante afectado
});

// Esquema de emisor
const EmisorSchema = new Schema({
    ruc: { type: String, required: true }, // RUC del emisor
    razonSocial: { type: String, required: true }, // Razón social del emisor
    direccionMatriz: { type: String, required: true }, // Dirección matriz del emisor
    direccionEstablecimiento: { type: String, required: true }, // Dirección del establecimiento
    tipoContribuyente: { type: String, enum: ['Persona Natural', 'Persona Jurídica', 'Contribuyente Especial'], required: true },
    obligadoContabilidad: { type: String, enum: ['SI', 'NO'], default: 'NO' } // Obligado a llevar contabilidad
});

// Esquema de la retención
const RetencionSchema = new Schema({
    claveAcceso: { type: String, required: true, unique: true }, // Clave de acceso
    ambiente: String, // Ambiente (1 para pruebas, 2 para producción)
    tipoEmision: String, // Tipo de emisión (1 para normal, 2 para contingencia)
    establecimiento: String, // Código del establecimiento
    puntoEmision: String, // Código del punto de emisión
    secuencial: String, // Secuencial único de la retención
    emisor: { type: EmisorSchema, required: true }, // Información del emisor (quien realiza la retención)

    // Receptor (proveedor al que se le retiene)
    receptor: {
        identificacion: String, // Identificación del receptor (cédula/RUC)
        tipoIdentificacion: String, // Tipo de identificación del receptor
        razonSocial: String, // Razón social del receptor
        direccion: String // Dirección del receptor
    },

    fechaEmision: { type: String, required: true }, // Fecha de emisión de la retención
    periodoFiscal: String, // Periodo fiscal (por ejemplo: 09/2024)
    comprobantesAfectados: [ComprobanteAfectadoSchema], // Comprobantes afectados
    impuestosRetenidos: [ImpuestoRetenidoSchema], // Impuestos retenidos

    totalRetenido: Number, // Total del valor retenido
    informacionAdicional: [ // Información adicional
        {
            nombre: String,
            valor: String
        }
    ],
    firma: { type: String } // Firma electrónica de la retención
});

module.exports = mongoose.model('Retencion', RetencionSchema);
