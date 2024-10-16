const { create } = require('xmlbuilder2');

function generarXMLRetencion(retencion) {
    const obj = {
        comprobanteRetencion: {
            '@id': 'comprobante',
            '@version': '1.0.0',
            infoTributaria: {
                ambiente: retencion.ambiente,
                tipoEmision: retencion.tipoEmision,
                razonSocial: retencion.emisor.razonSocial,
                nombreComercial: retencion.emisor.nombreComercial,
                ruc: retencion.emisor.ruc,
                claveAcceso: retencion.claveAcceso,
                codDoc: '07',
                estab: retencion.establecimiento,
                ptoEmi: retencion.puntoEmision,
                secuencial: retencion.secuencial,
                dirMatriz: retencion.emisor.direccionMatriz
            },
            infoCompRetencion: {
                fechaEmision: retencion.fechaEmision,
                dirEstablecimiento: retencion.emisor.direccionEstablecimiento,
                obligadoContabilidad: retencion.emisor.obligadoContabilidad,
                tipoIdentificacionSujetoRetenido: retencion.receptor.tipoIdentificacion,
                razonSocialSujetoRetenido: retencion.receptor.razonSocial,
                identificacionSujetoRetenido: retencion.receptor.identificacion,
                periodoFiscal: retencion.periodoFiscal
            },
            impuestos: {
                impuesto: retencion.impuestosRetenidos.map(impuesto => ({
                    codigo: impuesto.codigo,
                    codigoRetencion: impuesto.codigoPorcentaje,
                    baseImponible: impuesto.baseImponible, // Aseguramos que cada impuesto mantenga su base imponible única
                    porcentajeRetener: impuesto.porcentajeRetener,
                    valorRetenido: impuesto.valorRetenido,
                    codDocSustento: impuesto.codDocSustento,
                    numDocSustento: impuesto.numDocSustento,
                    fechaEmisionDocSustento: impuesto.fechaEmisionDocSustento
                }))
            },
            infoAdicional: {
                campoAdicional: retencion.informacionAdicional.map(info => ({
                    '@nombre': info.nombre,
                    '#text': info.valor
                }))
            }
        }
    };

    // Generar el XML con formato y líneas en blanco entre elementos
    const xml = create(obj).end({ prettyPrint: true, gap: '\n\n\n' });
    return xml;
}

module.exports = generarXMLRetencion;
