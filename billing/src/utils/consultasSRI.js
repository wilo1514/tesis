const axios = require('axios');
const { parseStringPromise } = require('xml2js');

async function consultarAutorizacion(claveAcceso) {
    const url = 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl';

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

        // Imprimir la respuesta completa para analizar su estructura
        console.log('Respuesta completa del SRI:', data);

        // Intentar parsear la respuesta XML
        const parsedResult = await parseStringPromise(data, { explicitArray: false });

        // Imprimir el resultado parseado para ver la estructura
        console.log('Resultado parseado:', JSON.stringify(parsedResult, null, 2));

        // Acceder a la estructura esperada
        const autorizacion = parsedResult['soapenv:Envelope']['soapenv:Body']['ns2:autorizacionComprobanteResponse']['autorizaciones']['autorizacion'];

        // Verificar si está autorizado
        if (autorizacion.estado === 'AUTORIZADO') {
            console.log('Factura autorizada:', autorizacion);
        } else {
            console.log('Factura no autorizada:', autorizacion);
        }

    } catch (error) {
        console.error('Error al consultar la autorización:', error);
    }
}

// Ejemplo de uso
const claveAcceso = '2109202401010480734200110011000000000320000003219';
consultarAutorizacion(claveAcceso);