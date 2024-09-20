const fs = require('fs');
const forge = require('node-forge');
const { SignedXml } = require('xml-crypto');

function firmarXML(xml, p12Path, p12Password) {


    try {
        // Leer el archivo .p12
        const p12Buffer = fs.readFileSync(p12Path);
        const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, p12Password);

        // Obtener la clave privada
        const keyBag = p12.getBags({ bagType: forge.pki.oids.keyBag });
        console.log('keyBag:', keyBag);  // Añadir log para depurar

        // Verificar si existe el índice 0
        if (!keyBag.keyBag || !keyBag.keyBag[0]) {
            throw new Error('No se pudo encontrar la clave privada en el archivo .p12');
        }

        const key = forge.pki.privateKeyToPem(keyBag.keyBag[0].key);

        // Obtener el certificado
        const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
        const cert = forge.pki.certificateToPem(certBags[0].cert);

        // Firmar el XML
        const sig = new SignedXml();
        sig.addReference("//*[local-name(.)='factura']");
        sig.signingKey = key;
        sig.keyInfoProvider = {
            getKeyInfo: () => `<X509Data><X509Certificate>${cert}</X509Certificate></X509Data>`
        };

        sig.computeSignature(xml);

        return sig.getSignedXml();
    } catch (error) {
        console.error('Error al firmar el XML:', error.message);
        throw error;  // Asegurarse de propagar el error correctamente
    }
}

module.exports = firmarXML;
