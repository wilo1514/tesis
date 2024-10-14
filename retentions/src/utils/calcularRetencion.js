function calcularRetencion(detalles, regimenProveedor, tipoContribuyenteEmisor) {
    const impuestosRetenidos = detalles.map(detalle => {
        const baseImponible = detalle.precioTotalSinImpuesto;

        // Definir variables para IVA y Renta retenida
        let porcentajeRetencionIVA;
        let porcentajeRetencionRenta;

        // Calcular Retención de IVA
        switch (tipoContribuyenteEmisor) {
            case 'Persona Natural':
                if (regimenProveedor === 'No obligado a llevar contabilidad') {
                    porcentajeRetencionIVA = 0.30; // 30% del IVA
                } else {
                    porcentajeRetencionIVA = 1.00; // 100% del IVA
                }
                break;
            case 'Persona Jurídica':
            case 'Contribuyente Especial':
                porcentajeRetencionIVA = 1.00; // 100% del IVA para personas jurídicas y contribuyentes especiales
                break;
            default:
                porcentajeRetencionIVA = 0.00; // No se retiene IVA
        }

        // Calcular Retención de Impuesto a la Renta (IR)
        switch (regimenProveedor) {
            case 'Persona Natural':
                porcentajeRetencionRenta = 0.01; // 1% para personas naturales no obligadas a llevar contabilidad
                break;
            case 'Persona Jurídica':
                porcentajeRetencionRenta = 0.02; // 2% para compras de bienes a personas jurídicas
                break;
            case 'Servicios Profesionales':
                porcentajeRetencionRenta = 0.10; // 10% para servicios profesionales
                break;
            case 'Pagos al Exterior':
                porcentajeRetencionRenta = 0.25; // 25% para servicios de no residentes
                break;
            case 'RIMPE':
                porcentajeRetencionRenta = 0.01; // 1% para contribuyentes bajo régimen RIMPE
                break;
            default:
                porcentajeRetencionRenta = 0.00; // No se retiene Impuesto a la Renta
        }

        // Cálculo del IVA retenido
        const valorIVA = detalle.impuestos.find(i => i.codigo === '2').valor; // Se asume que el código '2' es IVA
        const valorRetenidoIVA = valorIVA * porcentajeRetencionIVA;

        // Cálculo del Impuesto a la Renta retenido
        const valorRetenidoRenta = baseImponible * porcentajeRetencionRenta;

        // Devolver los valores de retención calculados
        return {
            codigo: detalle.impuestos[0].codigo, // Usamos el código del primer impuesto relacionado
            codigoPorcentaje: detalle.impuestos[0].codigoPorcentaje, // Usamos el código porcentaje
            baseImponible: baseImponible,
            valorRetenidoIVA: valorRetenidoIVA,
            valorRetenidoRenta: valorRetenidoRenta,
            codDocSustento: '01',  // Se asume que es una factura (cod 01)
            numDocSustento: detalle.numeroComprobante,
            fechaEmisionDocSustento: detalle.fechaEmisionComprobante
        };
    });

    return impuestosRetenidos;
}

module.exports = calcularRetencion;
