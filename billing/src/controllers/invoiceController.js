const axios = require('axios');
const fs = require('fs');
const Factura = require('../models/invoice');
const FacturaPendiente = require('../models/pendingInvoice');
const generarXMLFactura = require('../utils/xmlGenerator');
const reintentarEnvio = require('../utils/reintentarEnvio');
const enviarFactura = require('../utils/sriClient');
const consultarfactura = require('../utils/consultasSRI');
const path = require('path');
const generarClaveAcceso = require('../utils/generarClave'); // Importar la función de generar clave de acceso

async function obtenerDatosReceptor(clienteId) {
    try {
        const url = `http://172.18.0.1:3005/api/clients/${clienteId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los datos del receptor:', error.response?.status, error.response?.data || error.message);
        throw new Error('No se pudo obtener datos del cliente');
    }
}

exports.crearYEnviarFactura = async (req, res) => {
    try {
        const ambiente = req.body.emisor.ambiente;
        const tipoEmision = req.body.emisor.tipoEmision;
        const estab = req.body.emisor.estab;
        const ptoEmi = req.body.emisor.ptoEmi;
        const clienteId = req.body.clienteId;
        console.log(`Datos del cliente con ID: ${clienteId}\n`);
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
        console.log(`Clave Acceso: ${claveAcceso}\n`);

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

            console.log(`XML guardado en: ${filePath}\n`);

        } catch (error) {
            console.error('Error al guardar el XML:', error);
        }

        // Llamada al servicio de firmador
        const firmarResponse = await axios.post('http://172.18.0.1:8081/firmar', {
            xmlFilePath: filePath,
            ruc_empresa: req.body.emisor.ruc
        });

        console.log(`Respuesta del firmador: \n `, firmarResponse.data);

        if (firmarResponse.data.success) {
            const xmlFirmado = firmarResponse.data.xmlFirmado;

            // Enviar el XML firmado al SRI
            const enviado = await enviarFactura(xmlFirmado, ambiente);

            console.log(`Enviado firmado SRI: \n ${enviado}\n`);

            if (enviado) {

                // Retrasar la consulta de autorización por 4 segundos
                setTimeout(async () => {
                    // Realizar la consulta de autorización al SRI
                    //  console.log(claveAcceso, ambiente);
                    const autorizacion = await consultarfactura(claveAcceso, ambiente);
                    console.log(`Autorizacion: \n`, autorizacion);
                    // Verificar si la factura fue autorizada
                    if (autorizacion && autorizacion.estado === 'AUTORIZADO') {
                        // Si la factura fue autorizada, guardarla en la base de datos
                        factura.xmlFirmado = xmlFirmado;
                        await factura.save();
                        console.log('\n Factura guardada en la base de datos:\n', factura._id);
                        res.status(201).send(factura);
                    } else {
                        res.status(500).send({ message: '\nLa factura no fue autorizada.' });
                        console.log('Error: La factura no fue autorizada.');
                    }
                }, 6000); // 4 segundos de espera antes de la consulta
            } else {
                res.status(500).send({ message: '\nError al enviar la factura al SRI.' });
            }
        } else {
            res.status(500).send({ message: '\nError al firmar la factura.' });
        };

        const autorizacion = consultarfactura(
            claveAcceso,
            ambiente
        );
        console.log('\n La factura fue ', autorizacion);

    } catch (error) {
        console.error(' \n Error al crear y enviar la factura:', error);
        res.status(500).send({
            message: '\n Error al crear y enviar la factura',
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
            const reenviado = await reintentarEnvio(factura, facturaPendiente.xmlFirmado, ambiente);

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

exports.getInvoicesPorPuntoEmision = async (req, res) => {
    try {
        const { ptoEmi } = req.query;  // Obtener el punto de emisión de los parámetros de consulta

        // Verificamos que el parámetro 'ptoEmi' haya sido proporcionado
        if (!ptoEmi) {
            return res.status(400).json({ error: 'El parámetro punto de emisión (ptoEmi) es requerido.' });
        }

        // Filtrar las facturas que coincidan con el punto de emisión
        const facturas = await Factura.find({ 'emisor.ptoEmi': ptoEmi });

        // Si no hay facturas, devolvemos un mensaje adecuado
        if (facturas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron facturas para el punto de emisión proporcionado.' });
        }

        // Devolver las facturas filtradas
        res.status(200).json(facturas);
    } catch (error) {
        console.error('Error al obtener facturas por punto de emisión:', error);
        res.status(500).json({ error: 'Error al obtener facturas por punto de emisión.' });
    }
};