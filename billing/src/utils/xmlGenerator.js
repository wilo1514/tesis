const xml2js = require('xml2js');
const builder = new xml2js.Builder({ headless: true });

exports.generateXML = (invoice) => {
    const obj = {
        factura: {
            infoTributaria: {
                ruc: invoice.customerRuc,
                claveAcceso: 'clave_generada',
                codDoc: '01',
                estab: '001',
                ptoEmi: '001',
                secuencial: '000000123',
                dirMatriz: 'Dirección de la matriz'
            },
            infoFactura: {
                fechaEmision: new Date(invoice.issueDate).toISOString().split('T')[0],
                dirEstablecimiento: 'Dirección del establecimiento',
                totalSinImpuestos: invoice.details.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2),
                importeTotal: invoice.details.reduce((sum, item) => sum + (item.price * item.quantity * 1.12), 0).toFixed(2)
            },
            detalles: {
                detalle: invoice.details.map(item => ({
                    descripcion: item.description,
                    cantidad: item.quantity,
                    precioUnitario: item.price.toFixed(2),
                    precioTotalSinImpuesto: (item.price * item.quantity).toFixed(2)
                }))
            }
        }
    };
    return builder.buildObject(obj);
};

exports.signXML = (xml) => {
    return `<signedXml>${xml}</signedXml>`;
};
