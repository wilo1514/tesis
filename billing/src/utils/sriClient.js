const axios = require('axios');

async function enviarFactura(xmlFirmado, ambiente) {
    const url = ambiente === 'produccion'
        ? 'https://cel.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline'
        : 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline';

    try {
        const response = await axios.post(url, xmlFirmado, {
            headers: { 'Content-Type': 'application/xml' }
        });

        if (response.data.estado === 'RECIBIDA') {
            console.log('Factura recibida correctamente por el SRI');
            return true;
        } else {
            console.log('Error al enviar la factura:', response.data);
            return false;
        }
    } catch (error) {
        console.error('Error al enviar la factura al SRI:', error);
        return false;
    }
}

module.exports = enviarFactura;
