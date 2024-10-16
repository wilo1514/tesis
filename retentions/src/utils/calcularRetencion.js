const axios = require('axios');

// Función para obtener el porcentaje de retención desde el microservicio
async function obtenerPorcentajeRetencion(codigo, codigoPorcentaje) {
    try {
        const url = `http://172.18.0.1:3009/api/retentioncode/codigo/${codigoPorcentaje}?type=${codigo}`;
        console.log(`Consultando porcentaje de retención en: ${url}`);

        const response = await axios.get(url);
        console.log('Respuesta del microservicio:', response.data);

        return response.data.porcentaje; // Retornamos el porcentaje desde el microservicio
    } catch (error) {
        console.error('Error al obtener el porcentaje de retención:', error.response?.status, error.response?.data || error.message);
        throw new Error('No se pudo obtener el porcentaje de retención');
    }
}

async function calcularRetencion(detalles) {
    // Iteramos sobre cada detalle para calcular las retenciones de cada impuesto por separado
    const impuestosRetenidos = await Promise.all(detalles.map(async (detalle) => {
        const impuestosCalculados = await Promise.all(detalle.impuestos.map(async (impuesto) => {
            const baseImponible = impuesto.baseImponible;

            // Obtener el porcentaje de retención del microservicio según el código del impuesto y porcentaje
            const porcentajeRetener = await obtenerPorcentajeRetencion(impuesto.codigo, impuesto.codigoPorcentaje);
            const valorRetenido = (baseImponible * porcentajeRetener) / 100;

            console.log(`Código de impuesto: ${impuesto.codigo}, Código de porcentaje: ${impuesto.codigoPorcentaje}, Base Imponible: ${baseImponible}, Porcentaje a Retener: ${porcentajeRetener}, Valor Retenido: ${valorRetenido}`);

            // Devolvemos el cálculo de cada impuesto
            return {
                codigo: impuesto.codigo,
                codigoPorcentaje: impuesto.codigoPorcentaje,
                baseImponible: baseImponible, // Mantener la base imponible para este impuesto
                porcentajeRetener: porcentajeRetener,
                valorRetenido: valorRetenido,
                codDocSustento: '01', // Código del documento sustento (factura)
                numDocSustento: detalle.numeroComprobante,
                fechaEmisionDocSustento: detalle.fechaEmisionComprobante
            };
        }));

        return impuestosCalculados; // Devolvemos los impuestos calculados para este detalle
    }));

    return impuestosRetenidos.flat(); // Unimos todos los impuestos calculados en un solo array
}

module.exports = calcularRetencion;
