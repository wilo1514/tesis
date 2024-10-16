function calcularRetencion(detalles, regimenProveedor, tipoContribuyenteEmisor) {
    const impuestosRetenidos = detalles.map(detalle => {
        const baseImponible = detalle.precioTotalSinImpuesto;

        // Definir variables para IVA y Renta retenida
        let porcentajeRetencionIVA = 0;
        let porcentajeRetencionRenta = 0;

        // ** Ajuste en la retención del IVA según los códigos y parámetros del SRI
        switch (detalle.impuestos[0].codigoPorcentaje) {
            case '2': // Código del porcentaje para IVA
                if (tipoContribuyenteEmisor === 'Persona Natural') {
                    // Si es una persona natural, usamos el 30% del IVA
                    porcentajeRetencionIVA = 30;
                } else if (tipoContribuyenteEmisor === 'Persona Jurídica' || tipoContribuyenteEmisor === 'Contribuyente Especial') {
                    // Para personas jurídicas o contribuyentes especiales, retenemos el 100% del IVA
                    porcentajeRetencionIVA = 100;
                } else {
                    porcentajeRetencionIVA = 0; // Otros casos no retienen IVA
                }
                break;
            default:
                porcentajeRetencionIVA = 0; // No se retiene en casos no especificados
        }

        // ** Ajuste en la retención de Impuesto a la Renta (IR) basado en el régimen del proveedor
        switch (regimenProveedor) {
            case 'Persona Natural':
                porcentajeRetencionRenta = 1; // 1% para personas naturales no obligadas a llevar contabilidad
                break;
            case 'Persona Jurídica':
                porcentajeRetencionRenta = 2; // 2% para personas jurídicas
                break;
            case 'Servicios Profesionales':
                porcentajeRetencionRenta = 10; // 10% para servicios profesionales
                break;
            case 'Pagos al Exterior':
                porcentajeRetencionRenta = 25; // 25% para pagos al exterior
                break;
            case 'RIMPE':
                porcentajeRetencionRenta = 1; // 1% para régimen RIMPE
                break;
            default:
                porcentajeRetencionRenta = 0; // No se retiene si no está especificado
        }

        // Cálculo del IVA retenido
        const valorIVA = detalle.impuestos.find(i => i.codigo === '2')?.valor || 0;
        const valorRetenidoIVA = (valorIVA * porcentajeRetencionIVA) / 100;

        // Cálculo del Impuesto a la Renta retenido
        const valorRetenidoRenta = (baseImponible * porcentajeRetencionRenta) / 100;

        // Devolver los valores de retención calculados
        return {
            codigo: detalle.impuestos[0].codigo, // Código del impuesto
            codigoPorcentaje: detalle.impuestos[0].codigoPorcentaje, // Código del porcentaje
            baseImponible: baseImponible,
            porcentajeRetener: porcentajeRetencionIVA, // Porcentaje de retención del IVA
            valorRetenidoIVA: valorRetenidoIVA, // Valor retenido del IVA
            porcentajeRetencionRenta: porcentajeRetencionRenta, // Porcentaje de retención de Renta
            valorRetenidoRenta: valorRetenidoRenta, // Valor retenido de Renta
            codDocSustento: '01',  // Código del documento sustento (factura)
            numDocSustento: detalle.numeroComprobante,
            fechaEmisionDocSustento: detalle.fechaEmisionComprobante
        };
    });

    return impuestosRetenidos;
}

module.exports = calcularRetencion;
