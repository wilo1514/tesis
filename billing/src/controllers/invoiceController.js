const Factura = require('../models/invoice');
const FacturaPendiente = require('../models/pendingInvoice');
const generarXMLFactura = require('../utils/xmlGenerator');
const firmarxml = require('../utils/firmarXML');
const reintentarEnvio = require('../utils/reintentarEnvio');
const path = require('path');

async function obtenerDatosReceptor(clienteId) {
    const url = `http://clients:3005/api/clients/${clienteId}`; // URL del microservicio de clientes
    const response = await axios.get(url);
    return response.data;
}
exports.crearYEnviarFactura = async (req, res) => {
    try {
        const clienteId = req.body.receptorId;
        const receptor = await obtenerDatosReceptor(clienteId);

        const factura = new Factura({
            ...req.body,
            receptor
        });
        await factura.save();

        // Generar XML
        const xml = generarXMLFactura(factura);

        // Firmar XML
        const p12Path = path.join(__dirname, '../certificados/mi_certificado.p12');
        const p12Password = process.env.P12_PASSWORD;
        const xmlFirmado = firmarxml(xml, p12Path, p12Password);

        // Reintentar envío o almacenar en caso de fallo
        const ambiente = process.env.AMBIENTE;
        const enviado = await reintentarEnvio(factura, xmlFirmado, ambiente);

        if (enviado) {
            res.status(201).send(factura);
        } else {
            res.status(500).send({ message: 'Factura no pudo ser enviada. Almacenada para reintento.' });
        }
    } catch (error) {
        res.status(400).send({ message: 'Error al crear y enviar la factura', error });
    }
};
// Función para reenviar facturas pendientes manualmente
exports.reenviarFacturasPendientes = async (req, res) => {
    try {
        const facturasPendientes = await FacturaPendiente.find();

        for (const facturaPendiente of facturasPendientes) {
            const factura = await Factura.findById(facturaPendiente.facturaId);
            const reenviado = await reintentarEnvio(factura, facturaPendiente.xmlFirmado, process.env.AMBIENTE);

            if (reenviado) {
                await FacturaPendiente.findByIdAndDelete(facturaPendiente._id); // Eliminar la factura pendiente si se envió correctamente
            }
        }

        res.status(200).send({ message: 'Proceso de reenvío completado.' });
    } catch (error) {
        res.status(500).send({ message: 'Error al reenviar facturas pendientes', error });
    }
};