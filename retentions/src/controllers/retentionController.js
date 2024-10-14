const axios = require('axios');
const fs = require('fs');
const Retencion = require('../models/retention');
const RetencionPendiente = require('../models/pendingRetention');
const generarXMLRetencion = require('../utils/xmlGenerator');
const reintentarEnvio = require('../utils/reintentarEnvio');
const enviarRetencion = require('../utils/sriClient');
const consultarRetencion = require('../utils/consultasSRI');
const path = require('path');
const generarClaveAcceso = require('../utils/generarClave');
const calcularRetencion = require('../utils/calcularRetencion'); // Nueva utilidad

async function obtenerDatosReceptor(supplierId) {
    try {
        const url = `http://172.21.0.1:3003/api/suppliers/${supplierId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los datos del proveedor:', error.response?.status, error.response?.data || error.message);
        throw new Error('No se pudo obtener datos del proveedor');
    }
}

exports.crearYEnviarRetencion = async (req, res) => {
    try {
        const ambiente = process.env.AMBIENTE;
        const tipoEmision = process.env.EMISION;
        const estab = process.env.ESTAB;
        const ptoEmi = process.env.PTOEMI;
        const supplierId = req.body.supplierId;
        const emisor = req.body.emisor; // Emisor es ahora parte del cuerpo de la solicitud
        console.log(`Intentando obtener datos del proveedor con ID: ${supplierId}`);
        const proveedor = await obtenerDatosReceptor(supplierId);

        // Generar la fecha de emisión en formato DD/MM/AAAA
        const fechaEmision = new Date();
        const fechaEmisionFormateada = fechaEmision.toLocaleDateString('es-EC', { year: 'numeric', month: '2-digit', day: '2-digit' });

        // Generar la clave de acceso
        const amb = ambiente === 'produccion' ? '2' : '1';
        const claveAcceso = generarClaveAcceso(
            fechaEmisionFormateada,
            '07',
            emisor.ruc,
            amb,
            estab,
            ptoEmi,
            emisor.ret,
            tipoEmision
        );
        console.log('Clave de Acceso Generada:', claveAcceso);

        // Calcular las retenciones basadas en el régimen del proveedor y tipo de contribuyente del emisor
        const impuestosRetenidos = calcularRetencion(req.body.detalles, proveedor.Regimen, emisor.tipoContribuyente);

        // Crear la retención con la clave de acceso y la fecha de emisión
        const secuencial = emisor.ret;
        const retencion = new Retencion({
            ...req.body,
            amb: amb,
            tipoEmision: tipoEmision,
            estab: estab,
            ptoEmi: ptoEmi,
            secuencial: secuencial,
            receptor: proveedor, // Datos del proveedor como receptor
            fechaEmision: fechaEmisionFormateada,
            claveAcceso,
            impuestosRetenidos
        });
        console.log('Retención guardada en la base de datos:', retencion._id);

        // Generar XML
        const xml = generarXMLRetencion(retencion);

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
        const firmarResponse = await axios.post('http://172.21.0.1:8081/firmar', {
            xmlFilePath: filePath,
            ruc_empresa: emisor.ruc
        });

        console.log('Respuesta del firmador:', firmarResponse.data);

        if (firmarResponse.data.success) {
            const xmlFirmado = firmarResponse.data.xmlFirmado;
            // Ahora enviar el XML firmado al SRI
            const enviado = await enviarRetencion(xmlFirmado, process.env.AMBIENTE);
            if (enviado) {
                res.status(201).send(retencion);
                await retencion.save();
            } else {
                res.status(500).send({ message: 'Error al enviar la retención al SRI.' });
            }
        } else {
            res.status(500).send({ message: 'Error al firmar la retención.' });
        };
        const autorizacion = consultarRetencion(
            claveAcceso,
            process.env.AMBIENTE
        );
        console.log('La retención fue ', autorizacion);

    } catch (error) {
        console.error('Error al crear y enviar la retención:', error);
        res.status(500).send({
            message: 'Error al crear y enviar la retención',
            error: error.message,
            stack: error.stack
        });
    }
};