const Factura = require('../models/savebilling');
const consultarAutorizacion = require('../utils/consultasSRI');
const { parseStringPromise } = require('xml2js');

// Función para extraer el periodo fiscal (mes/año) de la fecha de emisión
function obtenerPeriodoFiscal(fechaEmision) {
    const [dia, mes, año] = fechaEmision.split('/');
    return `${mes}/${año}`;
}

// Controlador para guardar la factura
exports.saveBilling = async (req, res) => {
    try {
        const { numeroAutorizacion } = req.body;

        // Consultar la autorización del SRI
        const respuestaSRI = await consultarAutorizacion(numeroAutorizacion, process.env.AMBIENTE);
        if (respuestaSRI.error) {
            return res.status(400).json({ error: 'No se pudo obtener la autorización del SRI', detalles: respuestaSRI.detalles });
        } else {
            console.log(respuestaSRI);
        }

        // Parsear el XML de la factura
        const xmlFactura = await parseStringPromise(respuestaSRI.comprobanteXML, { explicitArray: false });
        const infoFactura = xmlFactura.factura;

        // Extraer datos clave
        const emisor = infoFactura.infoTributaria;
        const estab = infoFactura.infoTributaria.estab;
        const ptoEmi = infoFactura.infoTributaria.ptoEmi;
        const secuencial = infoFactura.infoTributaria.secuencial;
        const numeroComprobante = `${estab}-${ptoEmi}-${secuencial}`;
        const fechaEmision = infoFactura.infoFactura.fechaEmision;
        const periodoFiscal = obtenerPeriodoFiscal(fechaEmision);
        const totalSinImpuestos = parseFloat(infoFactura.infoFactura.totalSinImpuestos);
        const totalConImpuestos = infoFactura.infoFactura.totalConImpuestos.totalImpuesto.map(impuesto => ({
            codigo: impuesto.codigo,
            codigoPorcentaje: impuesto.codigoPorcentaje,
            baseImponible: parseFloat(impuesto.baseImponible),
            valor: parseFloat(impuesto.valor)
        }));

        // Manejo de los detalles de la factura
        const detalles = infoFactura.detalles.detalle.map(detalle => {
            const impuestos = Array.isArray(detalle.impuestos.impuesto)
                ? detalle.impuestos.impuesto.map(impuesto => ({
                    codigo: impuesto.codigo,
                    codigoPorcentaje: impuesto.codigoPorcentaje,
                    baseImponible: parseFloat(impuesto.baseImponible),
                    valor: parseFloat(impuesto.valor)
                }))
                : [{
                    codigo: detalle.impuestos.impuesto.codigo,
                    codigoPorcentaje: detalle.impuestos.impuesto.codigoPorcentaje,
                    baseImponible: parseFloat(detalle.impuestos.impuesto.baseImponible),
                    valor: parseFloat(detalle.impuestos.impuesto.valor)
                }];

            return {
                codigoPrincipal: detalle.codigoPrincipal,
                descripcion: detalle.descripcion,
                precioTotalSinImpuesto: parseFloat(detalle.precioTotalSinImpuesto),
                impuestos: impuestos
            };
        });

        // Crear el objeto factura
        const factura = new Factura({
            numeroAutorizacion: respuestaSRI.numeroAutorizacion,
            fechaEmision: fechaEmision,
            numeroComprobante: numeroComprobante,
            periodoFiscal: periodoFiscal,
            totalSinImpuestos: totalSinImpuestos,
            totalConImpuestos: totalConImpuestos,
            importeTotal: parseFloat(infoFactura.infoFactura.importeTotal),
            moneda: infoFactura.infoFactura.moneda,
            emisor: {
                ruc: emisor.ruc,
                razonSocial: emisor.razonSocial,
                nombreComercial: emisor.nombreComercial,
                direccionMatriz: emisor.dirMatriz,
                direccionEstablecimiento: infoFactura.infoFactura.dirEstablecimiento,
                contribuyenteEspecial: emisor.contribuyenteEspecial,
                obligadoContabilidad: infoFactura.infoFactura.obligadoContabilidad
            },
            detalles: detalles,
            informacionAdicional: infoFactura.infoAdicional ? infoFactura.infoAdicional.campoAdicional.map(campo => ({
                nombre: campo['@nombre'],
                valor: campo['#text']
            })) : []
        });

        // Guardar la factura en la base de datos
        await factura.save();
        res.status(201).json({ message: 'Factura guardada exitosamente', factura });

    } catch (error) {
        console.error('Error al guardar la factura:', error.message);
        res.status(500).json({ error: 'Error al guardar la factura', detalles: error.message });
    }
};
exports.getBillings = async (req, res) => {
    try {
        const facturas = await Factura.find();
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBillingById = async (req, res) => {
    try {
        const facturas = await Factura.findById(req.params.id);
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBilling = async (req, res) => {
    try {
        const factura = await Factura.findByIdAndDelete(req.params.id);
        if (!factura) {
            return res.status(404).json({ error: 'Factura not found' });
        }
        res.status(200).json({ message: 'Factura deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getBillingByNumeroComprobante = async (req, res) => {
    try {
        const factura = await Factura.findOne({ numeroComprobante: req.params.numeroComprobante });
        if (!factura) {
            return res.status(404).json({ error: 'Factura not found with the provided descripcion' });
        }
        res.status(200).json(factura);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getBillingByRUC = async (req, res) => {
    try {
        const facturas = await Factura.find({ 'emisor.ruc': req.params.ruc });
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Obtener detalles de una factura por número de comprobante
exports.getDetailsByNumeroComprobante = async (req, res) => {
    try {
        const factura = await Factura.findOne({ numeroComprobante: req.params.numeroComprobante });
        if (!factura) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }
        res.status(200).json(factura.detalles); // Solo los detalles de la factura
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


