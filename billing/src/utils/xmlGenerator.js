const { create } = require('xmlbuilder2');

function generarXMLFactura(factura) {
    const obj = {
        factura: {
            '@id': 'comprobante',
            '@version': '1.1.0',
            infoTributaria: {
                ambiente: factura.emisor.ambiente,
                tipoEmision: factura.emisor.tipoEmision,
                razonSocial: factura.emisor.razonSocial,
                nombreComercial: factura.emisor.nombreComercial,
                ruc: factura.emisor.ruc,
                claveAcceso: factura.claveAcceso,
                codDoc: '01',
                estab: factura.emisor.estab,
                ptoEmi: factura.emisor.ptoEmi,
                secuencial: factura.emisor.secuencial,
                dirMatriz: factura.emisor.direccionMatriz,
                contribuyenteRimpe: factura.emisor.contribuyenteRimpe
            },
            infoFactura: {
                fechaEmision: factura.fechaEmision,
                dirEstablecimiento: factura.emisor.direccionEstablecimiento,
                obligadoContabilidad: factura.emisor.obligadoContabilidad,
                tipoIdentificacionComprador: factura.receptor.tipoIdentificacion,
                razonSocialComprador: factura.receptor.razonSocial,
                identificacionComprador: factura.receptor.identificacion,
                totalSinImpuestos: factura.totalSinImpuestos,
                totalDescuento: factura.totalDescuento,
                totalConImpuestos: {
                    totalImpuesto: factura.detalles.map(detalle => ({
                        codigo: detalle.impuestos[0].codigo,
                        codigoPorcentaje: detalle.impuestos[0].codigoPorcentaje,
                        baseImponible: detalle.impuestos[0].baseImponible,
                        valor: detalle.impuestos[0].valor
                    }))
                },
                propina: factura.propina,
                importeTotal: factura.importeTotal,
                moneda: factura.moneda,
                pagos: {
                    pago: factura.pagos.map(pago => ({
                        formaPago: pago.formaPago,
                        total: pago.total,
                        plazo: pago.plazo,
                        unidadTiempo: pago.unidadTiempo
                    }))
                }
            },
            detalles: {
                detalle: factura.detalles.map(detalle => ({
                    codigoPrincipal: detalle.codigoPrincipal,
                    codigoAuxiliar: detalle.codigoAuxiliar,
                    descripcion: detalle.descripcion,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario,
                    descuento: detalle.descuento,
                    precioTotalSinImpuesto: detalle.precioTotalSinImpuesto,
                    impuestos: {
                        impuesto: detalle.impuestos.map(impuesto => ({
                            codigo: impuesto.codigo,
                            codigoPorcentaje: impuesto.codigoPorcentaje,
                            tarifa: impuesto.tarifa,
                            baseImponible: impuesto.baseImponible,
                            valor: impuesto.valor
                        }))
                    }
                }))
            }
        }
    };

    // Generar el XML con formato y líneas en blanco entre elementos
    const xml = create(obj).end({ prettyPrint: true, gap: '\n\n\n' });
    return xml;
}

module.exports = generarXMLFactura;
