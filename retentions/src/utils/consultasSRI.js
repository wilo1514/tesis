const axios = require('axios');
const { parseStringPromise } = require('xml2js');

async function consultarAutorizacion(claveAcceso, ambiente) {
    const url = ambiente === 'produccion'
        ? 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl'
        : 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl';

    const soapRequest = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ec="http://ec.gob.sri.ws.autorizacion">
            <soapenv:Header/>
            <soapenv:Body>
                <ec:autorizacionComprobante>
                    <claveAccesoComprobante>${claveAcceso}</claveAccesoComprobante>
                </ec:autorizacionComprobante>
            </soapenv:Body>
        </soapenv:Envelope>
    `;

    try {
        const { data } = await axios.post(url, soapRequest, {
            headers: {
                'Content-Type': 'text/xml',
                'SOAPAction': ''
            }
        });

        // Parsear la respuesta SOAP
        const parsedResult = await parseStringPromise(data, { explicitArray: false });

        // Acceder al resultado de autorización
        const autorizacion = parsedResult['soap:Envelope']['soap:Body']['ns2:autorizacionComprobanteResponse']['RespuestaAutorizacionComprobante']['autorizaciones']['autorizacion'];

        // Verificar si hay una autorización
        if (!autorizacion) {
            throw new Error('No se encontró la autorización en la respuesta.');
        }

        const estado = autorizacion.estado;
        const numeroAutorizacion = autorizacion.numeroAutorizacion || 'No disponible';
        const fechaAutorizacion = autorizacion.fechaAutorizacion || 'No disponible';
        const comprobanteXML = autorizacion.comprobante || 'No disponible';
        const mensajes = autorizacion.mensajes ? autorizacion.mensajes.mensaje : null;

        if (estado === 'AUTORIZADO') {
            return {
                claveAcceso: claveAcceso,
                estado: estado,
                numeroAutorizacion: numeroAutorizacion,
                fechaAutorizacion: fechaAutorizacion,
                comprobanteXML: comprobanteXML
            };
        } else {
            // Recopilar mensajes de error si no está autorizado
            const mensajesError = mensajes ? (Array.isArray(mensajes) ? mensajes : [mensajes]).map(msg => ({
                identificador: msg.identificador,
                mensaje: msg.mensaje,
                informacionAdicional: msg.informacionAdicional,
                tipo: msg.tipo
            })) : [];

            return {
                claveAcceso: claveAcceso,
                estado: estado,
                mensajesError: mensajesError.length ? mensajesError : 'No se encontraron mensajes de error'
            };
        }
    } catch (error) {
        console.error('Error al consultar la autorización:', error.message);
        return { error: 'No se pudo obtener la autorización.', detalles: error.message };
    }
}

// Para pruebas
// const xmlFilePath = '1610202407019041204000110011070000000180000001815';
// const ambiente = 'pruebas';  // Cambia a 'produccion' cuando sea necesario

// consultarAutorizacion(xmlFilePath, ambiente)
//     .then(result => {
//         console.log('Resultado del envío:', result);
//     })
//     .catch(error => {
//         console.error('Error inesperado:', error);
//     });

module.exports = consultarAutorizacion;
