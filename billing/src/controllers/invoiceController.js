const axios = require('axios');
const fs = require('fs');
const Factura = require('../models/invoice');
const FacturaPendiente = require('../models/pendingInvoice');
const generarXMLFactura = require('../utils/xmlGenerator');
const firmarxml = require('../utils/firmarXML');
const reintentarEnvio = require('../utils/reintentarEnvio');
const enviarFactura = require('../utils/sriClient');
const path = require('path');
const generarClaveAcceso = require('../utils/generarClave'); // Importar la función de generar clave de acceso

// async function obtenerDatosReceptor(clienteId) {
//     try {
//         const url = `http://172.22.0.1:3005/api/clients/${clienteId}`;
//         const response = await axios.get(url);
//         return response.data;
//     } catch (error) {
//         console.error('Error al obtener los datos del receptor:', error.response?.status, error.response?.data || error.message);
//         throw new Error('No se pudo obtener datos del cliente');
//     }
// }

// exports.crearYEnviarFactura = async (req, res) => {
//     try {
//         const ambiente = process.env.AMBIENTE;
//         const tipoEmision = process.env.EMISION;
//         const estab = process.env.ESTAB;
//         const ptoEmi = process.env.PTOEMI;
//         const clienteId = req.body.clienteId;
//         console.log(`Intentando obtener datos del cliente con ID: ${clienteId}`);
//         const receptor = await obtenerDatosReceptor(clienteId);

//         // Generar la fecha de emisión en formato DD/MM/AAAA
//         const fechaEmision = new Date();
//         const fechaEmisionFormateada = fechaEmision.toLocaleDateString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' });

//         // Generar la clave de acceso
//         const amb = ambiente === 'produccion' ? '2' : '1';
//         const claveAcceso = generarClaveAcceso(
//             fechaEmisionFormateada,
//             '01',
//             req.body.emisor.ruc,
//             amb,
//             estab,
//             ptoEmi,
//             req.body.emisor.fac,
//             tipoEmision
//         );
//         console.log('Clave de Acceso Generada:', claveAcceso);

//         // Crear la factura con la clave de acceso y la fecha de emisión
//         const secuencial = req.body.emisor.fac
//         const factura = new Factura({
//             ...req.body,
//             amb: amb, // Corregido para asegurar que sea '1' o '2'
//             tipoEmision: tipoEmision, // Asegurando que se pase '1' como tipo de emisión
//             estab: estab,
//             ptoEmi: ptoEmi,
//             secuencial: secuencial,
//             receptor,
//             fechaEmision: fechaEmisionFormateada,
//             claveAcceso
//         });
//         await factura.save();
//         console.log('Factura guardada en la base de datos:', factura._id);

//         // Generar XML
//         const xml = generarXMLFactura(factura);
//         //console.log('XML generado:', xml);

//         const dirPath = path.join('C:', 'temp', 'xmlsinf');


//         // Verificar si el directorio existe, si no, crearlo
//         if (!fs.existsSync(dirPath)) {
//             fs.mkdirSync(dirPath, { recursive: true });
//             console.log(`Directorio creado: ${dirPath}`);
//         }

//         const filePath = path.join(dirPath, `${claveAcceso}.xml`);

//         try {
//             fs.writeFileSync(filePath, xml, 'utf8');
//             console.log(`XML guardado en: ${filePath}`);
//         } catch (error) {
//             console.error('Error al guardar el XML:', error);
//         }

//         // Firmar XML
//         const p12Path = path.join(__dirname, '../firmas/certificado.pfx');
//         const p12Password = process.env.P12_PASSWORD;
//         const xmlFirmado = firmarxml(xml, p12Path, p12Password);
//         console.log('XML firmado:', xmlFirmado);

//         // Reintentar envío o almacenar en caso de fallo
//         const enviado = await reintentarEnvio(factura, xmlFirmado, ambiente);

//         if (enviado) {
//             console.log('Factura enviada exitosamente:', factura._id);
//             res.status(201).send(factura);
//         } else {
//             console.log('Factura no pudo ser enviada, almacenada para reintento:', factura._id);
//             res.status(500).send({ message: 'Factura no pudo ser enviada. Almacenada para reintento.' });
//         }
//     } catch (error) {
//         console.error('Error al crear y enviar la factura:', error);
//         res.status(500).send({
//             message: 'Error al crear y enviar la factura',
//             error: error.message,
//             stack: error.stack
//         });
//     }
// };


// Función para reenviar facturas pendientes manualmente
// exports.reenviarFacturasPendientes = async (req, res) => {
//     try {
//         const facturasPendientes = await FacturaPendiente.find();
//         console.log(`Facturas pendientes encontradas: ${facturasPendientes.length}`);

//         for (const facturaPendiente of facturasPendientes) {
//             const factura = await Factura.findById(facturaPendiente.facturaId);
//             if (!factura) {
//                 console.warn(`Factura no encontrada: ${facturaPendiente.facturaId}`);
//                 continue;
//             }
//             const reenviado = await reintentarEnvio(factura, facturaPendiente.xmlFirmado, process.env.AMBIENTE);

//             if (reenviado) {
//                 await FacturaPendiente.findByIdAndDelete(facturaPendiente._id);
//                 console.log(`Factura reenviada y eliminada de pendientes: ${facturaPendiente.facturaId}`);
//             } else {
//                 console.warn(`Factura no pudo ser reenviada: ${facturaPendiente.facturaId}`);
//             }
//         }

//         res.status(200).send({ message: 'Proceso de reenvío completado.' });
//     } catch (error) {
//         console.error('Error al reenviar facturas pendientes:', error);
//         res.status(500).send({ message: 'Error al reenviar facturas pendientes', error: error.message, stack: error.stack });
//     }
// };


async function enviarXMLFirmado() {
    try {
        // Ruta del archivo XML firmado
        const xmlPath = path.join(__dirname, '../firmas/firmado13.xml');
        console.log(`Ruta del archivo XML firmado: ${xmlPath}`);

        // Leer el archivo XML firmado
        const xmlFirmado = fs.readFileSync(xmlPath, 'utf8');

        // Ambiente de pruebas o producción
        const ambiente = 'pruebas'; // Cambiar a 'produccion' cuando corresponda

        // Enviar el XML al SRI
        const enviado = await enviarFactura(xmlFirmado, ambiente);

        if (enviado) {
            console.log('Factura enviada exitosamente al SRI.');
        } else {
            console.log('Error al enviar la factura al SRI.');
        }
    } catch (error) {
        console.error('Error al enviar el XML firmado al SRI:', error.message);
    }
}

// Ejecutar la función para enviar el XML
enviarXMLFirmado();