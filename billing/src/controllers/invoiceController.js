const axios = require('axios');
const fs = require('fs');
const Factura = require('../models/invoice');
const FacturaPendiente = require('../models/pendingInvoice');
const generarXMLFactura = require('../utils/xmlGenerator');
const firmarxml = require('../utils/firmador'); // Aquí asegúrate de que "firmador.js" sea la función correcta.
const reintentarEnvio = require('../utils/reintentarEnvio');
const enviarFactura = require('../utils/sriClient');
const consultarfactura = require('../utils/consultasSRI');
const path = require('path');
const generarClaveAcceso = require('../utils/generarClave'); // Importar la función de generar clave de acceso

async function obtenerDatosReceptor(clienteId) {
    try {
        const url = `http://172.18.0.6:3005/api/clients/${clienteId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los datos del receptor:', error.response?.status, error.response?.data || error.message);
        throw new Error('No se pudo obtener datos del cliente');
    }
}

exports.crearYEnviarFactura = async (req, res) => {
    try {
        const ambiente = process.env.AMBIENTE;
        const tipoEmision = process.env.EMISION;
        const estab = process.env.ESTAB;
        const ptoEmi = process.env.PTOEMI;
        const clienteId = req.body.clienteId;
        console.log(`Intentando obtener datos del cliente con ID: ${clienteId}`);
        const receptor = await obtenerDatosReceptor(clienteId);

        // Generar la fecha de emisión en formato DD/MM/AAAA
        const fechaEmisionFormateada = req.body.fechaEmision;

        // Generar la clave de acceso
        const amb = ambiente === 'produccion' ? '2' : '1';
        const claveAcceso = generarClaveAcceso(
            fechaEmisionFormateada,
            '01',
            req.body.emisor.ruc,
            amb,
            estab,
            ptoEmi,
            req.body.emisor.fac,
            tipoEmision
        );
        console.log('Clave de Acceso Generada:', claveAcceso);

        // Crear la factura con la clave de acceso y la fecha de emisión
        const secuencial = req.body.emisor.fac;
        const factura = new Factura({
            ...req.body,
            amb: amb, // Corregido para asegurar que sea '1' o '2'
            tipoEmision: tipoEmision, // Asegurando que se pase '1' como tipo de emisión
            estab: estab,
            ptoEmi: ptoEmi,
            secuencial: secuencial,
            receptor,
            fechaEmision: fechaEmisionFormateada,
            claveAcceso
        });

        // Generar XML
        const xml = generarXMLFactura(factura);

        const dirPath = path.join('/app/xmls');

        // Verificar si el directorio existe, si no, crearlo
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Directorio creado: ${dirPath}`);
        }

        const filePath = path.join(dirPath, `${claveAcceso}.xml`);

        try {
            fs.writeFileSync(filePath, xml, 'utf8');
            console.log(`XML guardado en: ${filePath}`);
        } catch (error) {
            console.error('Error al guardar el XML:', error);
        }

        // Llamada al servicio de firmador
        const firmarResponse = await axios.post('http://172.18.0.3:8081/firmar', {
            xmlFilePath: filePath,
            ruc_empresa: req.body.emisor.ruc
        });

        console.log('Respuesta del firmador:', firmarResponse.data);
        if (firmarResponse.data.success) {
            const xmlFirmado = firmarResponse.data.xmlFirmado;

            // Enviar el XML firmado al SRI
            const enviado = await enviarFactura(xmlFirmado, process.env.AMBIENTE);

            if (enviado) {
                // Retrasar la consulta de autorización por 4 segundos
                setTimeout(async () => {
                    // Realizar la consulta de autorización al SRI
                    console.log(claveAcceso, process.env.AMBIENTE);
                    const autorizacion = await consultarfactura(claveAcceso, process.env.AMBIENTE);
                    console.log(autorizacion);
                    // Verificar si la factura fue autorizada
                    if (autorizacion && autorizacion.estado === 'AUTORIZADO') {
                        // Si la factura fue autorizada, guardarla en la base de datos
                        factura.xmlFirmado = xmlFirmado;
                        await factura.save();
                        console.log('Factura guardada en la base de datos:', factura._id);
                        res.status(201).send(factura);
                    } else {
                        res.status(500).send({ message: 'La factura no fue autorizada.' });
                        console.log('Error: La factura no fue autorizada.');
                    }
                }, 6000); // 4 segundos de espera antes de la consulta
            } else {
                res.status(500).send({ message: 'Error al enviar la factura al SRI.' });
            }
        } else {
            res.status(500).send({ message: 'Error al firmar la factura.' });
        };

        const autorizacion = consultarfactura(
            claveAcceso,
            process.env.AMBIENTE
        );
        console.log('La factura fue ', autorizacion);

    } catch (error) {
        console.error('Error al crear y enviar la factura:', error);
        res.status(500).send({
            message: 'Error al crear y enviar la factura',
            error: error.message,
            stack: error.stack
        });
    }
};

// Función para reenviar facturas pendientes manualmente
exports.reenviarFacturasPendientes = async (req, res) => {
    try {
        const facturasPendientes = await FacturaPendiente.find();
        console.log(`Facturas pendientes encontradas: ${facturasPendientes.length}`);

        for (const facturaPendiente of facturasPendientes) {
            const factura = await Factura.findById(facturaPendiente.facturaId);
            if (!factura) {
                console.warn(`Factura no encontrada: ${facturaPendiente.facturaId}`);
                continue;
            }
            const reenviado = await reintentarEnvio(factura, facturaPendiente.xmlFirmado, process.env.AMBIENTE);

            if (reenviado) {
                await FacturaPendiente.findByIdAndDelete(facturaPendiente._id);
                console.log(`Factura reenviada y eliminada de pendientes: ${facturaPendiente.facturaId}`);
            } else {
                console.warn(`Factura no pudo ser reenviada: ${facturaPendiente.facturaId}`);
            }
        }

        res.status(200).send({ message: 'Proceso de reenvío completado.' });
    } catch (error) {
        console.error('Error al reenviar facturas pendientes:', error);
        res.status(500).send({ message: 'Error al reenviar facturas pendientes', error: error.message, stack: error.stack });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Factura.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
